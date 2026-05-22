const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Client = require('../models/clientModel');
const IdempotencyKey = require('../models/idempotencyKeyModel');
const gerarMensagemWhatsApp = require('../utils/whatsappUtils');
const { sendServerError } = require('../utils/errorUtils');
const crypto = require('crypto');

const ORDER_CREATE_ENDPOINT = 'POST:/api/pedidos';
const IDEMPOTENCY_KEY_MAX_LENGTH = 128;
const IDEMPOTENCY_TTL_SECONDS = Math.max(60, Number.parseInt(process.env.IDEMPOTENCY_TTL_SECONDS || '900', 10));

function createHttpError(status, msg) {
    const error = new Error(msg);
    error.status = status;
    return error;
}

function normalizeForHash(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeForHash);
    }

    if (value && typeof value === 'object') {
        const sortedKeys = Object.keys(value).sort();
        const normalized = {};

        for (const key of sortedKeys) {
            normalized[key] = normalizeForHash(value[key]);
        }

        return normalized;
    }

    return value;
}

function hashRequestBody(body) {
    const normalized = normalizeForHash(body || {});
    return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

async function getReplayedOrder(idempotencyDoc) {
    return Order.findById(idempotencyDoc.order)
        .populate('cliente')
        .populate('produtos.produto');
}

// Criar novo pedido
exports.criarPedido = async (req, res) => {
    let session;
    const idempotencyKey = req.header('Idempotency-Key')?.trim();
    const requestHash = idempotencyKey ? hashRequestBody(req.body) : null;

    try {
        const { cliente, produtos, metodoEntrega } = req.body;

        if (idempotencyKey && idempotencyKey.length > IDEMPOTENCY_KEY_MAX_LENGTH) {
            return res.status(400).json({ msg: 'Idempotency-Key inválida. Máximo de 128 caracteres.' });
        }

        if (idempotencyKey) {
            const existingKey = await IdempotencyKey.findOne({
                key: idempotencyKey,
                endpoint: ORDER_CREATE_ENDPOINT
            });

            if (existingKey) {
                if (existingKey.requestHash !== requestHash) {
                    return res.status(409).json({
                        msg: 'Idempotency-Key já utilizada com payload diferente.'
                    });
                }

                const pedidoRepetido = await getReplayedOrder(existingKey);

                if (pedidoRepetido) {
                    res.set('Idempotency-Replayed', 'true');
                    return res.status(200).json(pedidoRepetido);
                }

                await IdempotencyKey.deleteOne({ _id: existingKey._id });
            }
        }

        if (!cliente || !produtos || !metodoEntrega) {
            return res.status(400).json({ msg: 'Cliente, produtos e método de entrega são obrigatórios.' });
        }

        if (!Array.isArray(produtos) || produtos.length === 0) {
            return res.status(400).json({ msg: 'Pedido deve ter pelo menos um produto.' });
        }

        session = await Order.startSession();

        let total = 0;
        const produtosProcessados = [];

        let pedidoId;
        await session.withTransaction(async () => {
            const clienteExiste = await Client.findById(cliente).session(session);
            if (!clienteExiste) {
                throw createHttpError(404, 'Cliente não encontrado.');
            }

            for (const item of produtos) {
                if (!item?.produto || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                    throw createHttpError(400, 'Cada item do pedido deve ter produto e quantidade válida.');
                }

                const produtoAtualizado = await Product.findOneAndUpdate(
                    {
                        _id: item.produto,
                        ativo: true,
                        emEstoque: true,
                        quantidade: { $gte: item.quantidade }
                    },
                    { $inc: { quantidade: -item.quantidade } },
                    { new: true, session }
                );

                if (!produtoAtualizado) {
                    const produtoExiste = await Product.findById(item.produto).session(session);

                    if (!produtoExiste || !produtoExiste.ativo) {
                        throw createHttpError(404, `Produto ${item.produto} não encontrado.`);
                    }

                    throw createHttpError(400, `Produto ${produtoExiste.nome} sem estoque suficiente.`);
                }

                const subtotal = produtoAtualizado.preco * item.quantidade;
                total += subtotal;

                produtosProcessados.push({
                    produto: produtoAtualizado._id,
                    quantidade: item.quantidade,
                    precoUnitario: produtoAtualizado.preco,
                    subtotal
                });
            }

            if (metodoEntrega === 'entrega') {
                const taxaEntrega = req.body.taxaEntrega || 5;
                total += taxaEntrega;
            }

            const [pedido] = await Order.create([
                {
                    cliente,
                    produtos: produtosProcessados,
                    total,
                    metodoEntrega,
                    taxaEntrega: metodoEntrega === 'entrega' ? (req.body.taxaEntrega || 5) : 0,
                    enderecoEntrega: req.body.enderecoEntrega,
                    observacoes: req.body.observacoes
                }
            ], { session });

            pedidoId = pedido._id;

            if (idempotencyKey) {
                const expiresAt = new Date(Date.now() + (IDEMPOTENCY_TTL_SECONDS * 1000));

                await IdempotencyKey.create([
                    {
                        key: idempotencyKey,
                        endpoint: ORDER_CREATE_ENDPOINT,
                        requestHash,
                        order: pedidoId,
                        expiresAt
                    }
                ], { session });
            }
        });

        const pedidoCompleto = await Order.findById(pedidoId)
            .populate('cliente')
            .populate('produtos.produto');

        res.status(201).json(pedidoCompleto);
    } catch (err) {
        if (idempotencyKey && err?.code === 11000) {
            const existingKey = await IdempotencyKey.findOne({
                key: idempotencyKey,
                endpoint: ORDER_CREATE_ENDPOINT
            });

            if (existingKey) {
                if (existingKey.requestHash !== requestHash) {
                    return res.status(409).json({
                        msg: 'Idempotency-Key já utilizada com payload diferente.'
                    });
                }

                const pedidoRepetido = await getReplayedOrder(existingKey);
                if (pedidoRepetido) {
                    res.set('Idempotency-Replayed', 'true');
                    return res.status(200).json(pedidoRepetido);
                }
            }
        }

        if (err.status) {
            return res.status(err.status).json({ msg: err.message });
        }

        sendServerError(res, 'Erro ao criar pedido', err);
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

// Listar pedidos
exports.listarPedidos = async (req, res) => {
    try {
        const query = req.query || {};
        const { status, cliente } = query;
        const page = Number.parseInt(query.page, 10);
        const limit = Number.parseInt(query.limit, 10);
        const filtros = {};
        const shouldPaginate = Number.isInteger(page) || Number.isInteger(limit);

        if (status) filtros.status = status;
        if (cliente) filtros.cliente = cliente;

        if (!shouldPaginate) {
            const pedidos = await Order.find(filtros)
                .populate('cliente')
                .populate('produtos.produto')
                .sort({ createdAt: -1 });

            return res.json(pedidos);
        }

        const safePage = Number.isInteger(page) && page > 0 ? page : 1;
        const safeLimitRaw = Number.isInteger(limit) && limit > 0 ? limit : 20;
        const safeLimit = Math.min(safeLimitRaw, 100);
        const skip = (safePage - 1) * safeLimit;

        const [pedidos, total] = await Promise.all([
            Order.find(filtros)
                .populate('cliente')
                .populate('produtos.produto')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit),
            Order.countDocuments(filtros)
        ]);

        return res.json({
            data: pedidos,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit)
            }
        });
    } catch (err) {
        sendServerError(res, 'Erro ao listar pedidos', err);
    }
};

// Buscar pedido por ID
exports.buscarPedido = async (req, res) => {
    try {
        const pedido = await Order.findById(req.params.id)
            .populate('cliente')
            .populate('produtos.produto');

        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido não encontrado' });
        }

        res.json(pedido);
    } catch (err) {
        sendServerError(res, 'Erro ao buscar pedido', err);
    }
};

// Atualizar status do pedido
exports.atualizarStatusPedido = async (req, res) => {
    try {
        const { status } = req.body;
        
        const statusValidos = ['pendente', 'em preparação', 'pronto', 'enviado', 'concluído', 'cancelado'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ msg: 'Status inválido' });
        }

        const pedido = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('cliente').populate('produtos.produto');

        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido não encontrado' });
        }

        res.json(pedido);
    } catch (err) {
        sendServerError(res, 'Erro ao atualizar status', err);
    }
};

// Deletar/Cancelar pedido
exports.deletarPedido = async (req, res) => {
    let session;

    try {
        session = await Order.startSession();

        await session.withTransaction(async () => {
            const pedido = await Order.findById(req.params.id).session(session);

            if (!pedido) {
                throw createHttpError(404, 'Pedido não encontrado');
            }

            if (pedido.status === 'pendente') {
                for (const item of pedido.produtos) {
                    await Product.findByIdAndUpdate(
                        item.produto,
                        { $inc: { quantidade: item.quantidade } },
                        { session }
                    );
                }
            }

            await Order.findByIdAndUpdate(
                req.params.id,
                { status: 'cancelado' },
                { session }
            );
        });
        
        res.json({ msg: 'Pedido cancelado com sucesso' });
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ msg: err.message });
        }

        sendServerError(res, 'Erro ao cancelar pedido', err);
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

// Gerar link do WhatsApp
exports.gerarWhatsApp = async (req, res) => {
    try {
        const pedido = await Order.findById(req.params.id)
            .populate('cliente')
            .populate('produtos.produto');

        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido não encontrado' });
        }

        const linkWhatsApp = gerarMensagemWhatsApp(pedido);
        
        res.json({ 
            linkWhatsApp,
            mensagem: 'Link do WhatsApp gerado com sucesso'
        });
    } catch (err) {
        sendServerError(res, 'Erro ao gerar link do WhatsApp', err);
    }
};






