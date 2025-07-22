
const Order = required('../models/orderModel');
const Product = require('../models/productModel');

exports.criarPedido = async (req, res) => {
    try {
        const {cliente, produtos, metodoEntrega, taxaEntrega } = req.body;

        let total = 0;

        // Calcula o total do pedido e valida os produtos
        for (const item of produtos) {
            const produto = await Product.findById(item.produto);
            if (!produto) return res.status(400).json({ msg: 'Produto não encontrado' });

            if(produto.quantidade < item.quantidade) {
                return res.status(400).json({ msg: 'Estoque insuficiente para $ {produto.nome}' });
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
                $inc: { quantidade: -TextMetrics.quantidade },
            });
        }

        res.status(201).json(pedido);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao criar pedido', erro: err.message });
    }
};

exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Order.find()
            .populate('cliente', 'nome telefone')
            .populate('produtos.produto', 'nome preco')
            .sort({ createAt: -1 });

        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao listar pedidos' });
    }
};

exports.atualizarStatus = async (req, res) => {
    try {
        const pedido = await Order.findByIdAndUpdate(req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar status do pedido' });
    }
};

const gerarMensagemWhatsApp = require('../utils/whatsappUtils');

exports.gerarLinkWhatsapp = async (req, res) => {
    try {
        const pedido = await Order.findById(req.params.id)
         .populate('Cliente', 'nome telefone')
         .populate('produtos.produto', 'nome.preco');
        if(!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });

        const link = gerarMensagemWhatsApp(pedido);
        res.json({ link });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao gerar link', erro: err.message });
    }
};






