const Product = require('../models/productModel');

// Criar novo produto
exports.criarProduto = async (req, res) => {
    try {
        const { nome, preco, categoria } = req.body;
        
        if (!nome || !preco || !categoria) {
            return res.status(400).json({ msg: 'Nome, preço e categoria são obrigatórios.' });
        }

        const produto = await Product.create(req.body);
        res.status(201).json(produto);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao criar produto', erro: err.message });
    }
};

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const { categoria, emEstoque, destaque } = req.query;
        const filtros = { ativo: true };

        if (categoria) filtros.categoria = categoria;
        if (emEstoque !== undefined) filtros.emEstoque = emEstoque === 'true';
        if (destaque !== undefined) filtros.destaque = destaque === 'true';

        const produtos = await Product.find(filtros).sort({ createdAt: -1 });
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao listar produtos', erro: err.message });
    }
};

// Buscar produto por ID
exports.buscarProduto = async (req, res) => {
    try {
        const produto = await Product.findById(req.params.id);
        if (!produto || !produto.ativo) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }
        res.json(produto);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar produto', erro: err.message });
    }
};

// Buscar produtos por nome
exports.buscarPorNome = async (req, res) => {
    try {
        const { nome } = req.query;
        
        if (!nome) {
            return res.status(400).json({ msg: 'Nome é obrigatório para busca' });
        }

        const produtos = await Product.find({
            nome: { $regex: nome, $options: 'i' },
            ativo: true
        });

        res.json(produtos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar produtos', erro: err.message });
    }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
    try {
        const produtoAtualizado = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!produtoAtualizado) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        res.json(produtoAtualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar produto', erro: err.message });
    }
};

// Atualizar estoque
exports.atualizarEstoque = async (req, res) => {
    try {
        const { quantidade } = req.body;

        if (quantidade === undefined || quantidade < 0) {
            return res.status(400).json({ msg: 'Quantidade deve ser um número não negativo' });
        }

        const produto = await Product.findByIdAndUpdate(
            req.params.id,
            { 
                quantidade,
                emEstoque: quantidade > 0
            },
            { new: true, runValidators: true }
        );

        if (!produto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        res.json(produto);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar estoque', erro: err.message });
    }
};

// Deletar produto (desativar)
exports.deletarProduto = async (req, res) => {
    try {
        const produto = await Product.findByIdAndUpdate(
            req.params.id,
            { ativo: false },
            { new: true }
        );

        if (!produto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        res.json({ msg: 'Produto desativado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar produto', erro: err.message });
    }
};



