const Product = require('../models/productModel');

// Criar novo produto
exports.criarProduto = async (req, res) => {
    try {
        const produto = await Product.create(req.body);
        res.status(201).json(produto);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao cadastrar produto', erro: err.message });
    }
};

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Product.find().sort({ createdAt: -1 });
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar produtos', erro: err.message });
    }
};

// Buscar produto por ID
exports.buscarProduto = async (req, res) => {
    try {
        const produto = await Product.findById(req.params.id);
        if (!produto) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json(produto);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar produto', erro: err.message });
    }
};

//Buscar produto por nome
exports.buscarPorNome = async (req, res) => {
    try {
        const produto = await Product.findByName(req.query.nome);
        if (!produto) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json(produto);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar produto', erro: err.message });
    }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
    try {
        const atualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!atualizado) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json(atualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar produto', erro: err.message });
    }
};

// Atualizar estoque
exports.atualizarEstoque = async (req, res) => {
    try {
        const produto = await Product.findById(req.params.id);
        if (!produto) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json(atualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar estoque', erro: err.message });
    }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
    try {
        const deletado = await Product.findByIdAndDelete(req.params.id);
        if (!deletado) return res.status(404).json({ msg: 'Produto não encontrado' });
        res.json({ msg: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar produto', erro: err.message });
    }
};



