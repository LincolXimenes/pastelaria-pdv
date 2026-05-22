const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Client = require('../models/clientModel');
const gerarMensagemWhatsApp = require('../utils/whatsappUtils');
const { sendServerError } = require('../utils/errorUtils');

// Criar novo pedido
exports.criarPedido = async (req, res) => {
    try {
        const { cliente, produtos, metodoEntrega } = req.body;

        if (!cliente || !produtos || !metodoEntrega) {
            return res.status(400).json({ msg: 'Cliente, produtos e método de entrega são obrigatórios.' });
        }

        if (produtos.length === 0) {
            return res.status(400).json({ msg: 'Pedido deve ter pelo menos um produto.' });
        }

        // Verificar se cliente existe
        const clienteExiste = await Client.findById(cliente);
        if (!clienteExiste) {
            return res.status(404).json({ msg: 'Cliente não encontrado.' });
        }

        // Calcular total e validar produtos
        let total = 0;
        const produtosProcessados = [];

        for (const item of produtos) {
            const produto = await Product.findById(item.produto);
            if (!produto || !produto.ativo) {
                return res.status(404).json({ msg: `Produto ${item.produto} não encontrado.` });
            }

            if (!produto.emEstoque || produto.quantidade < item.quantidade) {
                return res.status(400).json({ msg: `Produto ${produto.nome} sem estoque suficiente.` });
            }

            const subtotal = produto.preco * item.quantidade;
            total += subtotal;

            produtosProcessados.push({
                produto: produto._id,
                quantidade: item.quantidade,
                precoUnitario: produto.preco,
                subtotal
            });

            // Atualizar estoque
            await Product.findByIdAndUpdate(produto._id, {
                $inc: { quantidade: -item.quantidade }
            });
        }

        // Adicionar taxa de entrega se for entrega
        if (metodoEntrega === 'entrega') {
            const taxaEntrega = req.body.taxaEntrega || 5; // Taxa padrão
            total += taxaEntrega;
        }

        const pedido = await Order.create({
            cliente,
            produtos: produtosProcessados,
            total,
            metodoEntrega,
            taxaEntrega: metodoEntrega === 'entrega' ? (req.body.taxaEntrega || 5) : 0,
            enderecoEntrega: req.body.enderecoEntrega,
            observacoes: req.body.observacoes
        });

        const pedidoCompleto = await Order.findById(pedido._id)
            .populate('cliente')
            .populate('produtos.produto');

        res.status(201).json(pedidoCompleto);
    } catch (err) {
        sendServerError(res, 'Erro ao criar pedido', err);
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
    try {
        const pedido = await Order.findById(req.params.id);
        
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido não encontrado' });
        }

        // Se o pedido ainda está pendente, devolver produtos ao estoque
        if (pedido.status === 'pendente') {
            for (const item of pedido.produtos) {
                await Product.findByIdAndUpdate(item.produto, {
                    $inc: { quantidade: item.quantidade }
                });
            }
        }

        await Order.findByIdAndUpdate(req.params.id, { status: 'cancelado' });
        
        res.json({ msg: 'Pedido cancelado com sucesso' });
    } catch (err) {
        sendServerError(res, 'Erro ao cancelar pedido', err);
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






