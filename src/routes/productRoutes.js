const express = require('express');
const router = express.Router();
const {
    criarProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    deletarProduto
} = require('../controllers/productController');

// Rotas de produtos
router.post('/', criarProduto);             // Criar novo produto
router.get('/', listarProdutos);            // Listar todos os produtos
router.get('/:id', buscarProduto);          // Buscar produto por ID
router.put('/:id', atualizarProduto);       // Atualizar produto por ID
router.delete('/:id', deletarProduto);      // Deletar produto por ID

module.exports = router;

