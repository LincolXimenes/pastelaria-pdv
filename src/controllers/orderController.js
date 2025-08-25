const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const gerarMensagemWhatsApp = require('../utils/whatsappUtils');
//const { models } = require('mongoose');
//const Pedido = require('../models/orderModel');

// Criar pedido
exports.criarPedido = async (req, res) => {
    try {
        const { cliente, produtos, metodoEntrega, taxaEntrega } = req.body;

        if (!cliente || !produtos || !Array.isArray(produtos) || produtos.length === 0) {
            return res.status(400).json({ msg: 'Cliente e produtos são obrigatórios.' });
        }

        let total = 0;

        // Calcula o total do pedido e valida os produtos
        for (const item of produtos) {
            const produto = await Product.findById(item.produto);
            if (!produto) return res.status(400).json({ msg: 'Produto não encontrado' });

            if (produto.quantidade < item.quantidade) {
                return res.status(400).json({ msg: `Estoque insuficiente para ${produto.nome}` });
            }

            total += produto.preco * item.quantidade;
        }

        // Adiciona a taxa de entrega (se houver)
        const totalFinal = total + (taxaEntrega || 0);

        // Cria o pedido
        const pedido = await Order.create({
            cliente,
            produtos,
            metodoEntrega,
            taxaEntrega,
            total: totalFinal
        });

        // Atualiza o estoque
        for (const item of produtos) {
            await Product.findByIdAndUpdate(item.produto, {
                $inc: { quantidade: -item.quantidade },
            });
        }

        res.status(201).json(pedido);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao criar pedido', erro: err.message });
    }
};

// Listar pedidos (com filtro opcional por status)
exports.listarPedidos = async (req, res) => {
    try {
        const filtro = {};
        if (req.query.status) {
            filtro.status = req.query.status;
        }

        const pedidos = await Order.find(filtro)
            .populate('cliente', 'nome telefone')
            .populate('produtos.produto', 'nome preco')
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
            .populate('cliente', 'nome telefone')
            .populate('produtos.produto', 'nome preco');
        if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar pedido', erro: err.message });
    }
};

// Atualizar status do pedido
exports.atualizarStatus = async (req, res) => {
    try {
        const statusValido = [
            'pendente',
            'em preparação',
            'pronto',
            'enviado',
            'concluído'
        ];

        if (!statusValido.includes(req.body.status)) {
            return res.status(400).json({ msg: 'Status inválido' });
        }

        const pedido = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });

        res.json(pedido);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar status', erro: err.message });
    }
};

// Gerar link do WhatsApp para o pedido
exports.gerarLinkWhatsapp = async (req, res) => {
    try {
        const pedido = await Order.findById(req.params.id)
            .populate('cliente', 'nome telefone')
            .populate('produtos.produto', 'nome preco');
        if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });

        const link = gerarMensagemWhatsApp(pedido);
        res.json({ link });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao gerar link', erro: err.message });
    }
};

// Cancelar pedido (apenas administradores)
exports.cancelarPedido = async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ msg: 'Acesso negado: apenas administradores' });
    }

    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });

        // Repor estoque antes de deletar
        for (const item of pedido.produtos) {
            await Product.findByIdAndUpdate(item.produto, {
                $inc: { quantidade: item.quantidade },
            });
        }

        await pedido.deleteOne(); // Agora deleta o pedido

        res.json({ msg: 'Pedido cancelado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao cancelar pedido', erro: err.message });
    }
}






