const Product = require('../models/productModel');
const { sendServerError } = require('../utils/errorUtils');

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
        sendServerError(res, 'Erro ao criar produto', err);
    }
};

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const query = req.query || {};
        const { categoria, emEstoque, destaque } = query;
        const page = Number.parseInt(query.page, 10);
        const limit = Number.parseInt(query.limit, 10);
        const filtros = { ativo: true };
        const shouldPaginate = Number.isInteger(page) || Number.isInteger(limit);

        if (categoria) filtros.categoria = categoria;
        if (emEstoque !== undefined) filtros.emEstoque = emEstoque === 'true';
        if (destaque !== undefined) filtros.destaque = destaque === 'true';

        if (!shouldPaginate) {
            const produtos = await Product.find(filtros).sort({ createdAt: -1 });
            return res.json(produtos);
        }

        const safePage = Number.isInteger(page) && page > 0 ? page : 1;
        const safeLimitRaw = Number.isInteger(limit) && limit > 0 ? limit : 20;
        const safeLimit = Math.min(safeLimitRaw, 100);
        const skip = (safePage - 1) * safeLimit;

        const [produtos, total] = await Promise.all([
            Product.find(filtros).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
            Product.countDocuments(filtros)
        ]);

        return res.json({
            data: produtos,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit)
            }
        });
    } catch (err) {
        sendServerError(res, 'Erro ao listar produtos', err);
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
        sendServerError(res, 'Erro ao buscar produto', err);
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
        sendServerError(res, 'Erro ao buscar produtos', err);
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
        sendServerError(res, 'Erro ao atualizar produto', err);
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
        sendServerError(res, 'Erro ao atualizar estoque', err);
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
        sendServerError(res, 'Erro ao deletar produto', err);
    }
};



