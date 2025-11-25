const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Client = require('../models/clientModel');
const gerarMensagemWhatsApp = require('../utils/whatsappUtils');

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
        res.status(500).json({ msg: 'Erro ao criar pedido', erro: err.message });
    }
};

// Listar pedidos
exports.listarPedidos = async (req, res) => {
    try {
        const { status, cliente } = req.query;
        const filtros = {};

        if (status) filtros.status = status;
        if (cliente) filtros.cliente = cliente;

        const pedidos = await Order.find(filtros)
            .populate('cliente')
            .populate('produtos.produto')
            .sort({ createdAt: -1 });

        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao listar pedidos', erro: err.message });
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
        res.status(500).json({ msg: 'Erro ao buscar pedido', erro: err.message });
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
        res.status(500).json({ msg: 'Erro ao atualizar status', erro: err.message });
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
        res.status(500).json({ msg: 'Erro ao cancelar pedido', erro: err.message });
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
        res.status(500).json({ msg: 'Erro ao gerar link do WhatsApp', erro: err.message });
    }
};






