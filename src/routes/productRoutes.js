const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    criarProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    deletarProduto,
    buscarPorNome,
    atualizarEstoque,
} = require('../controllers/productController');

router.get('/protegido', auth, listarProdutos);

// Rotas de produtos
router.post('/', criarProduto);                // Criar novo produto
router.get('/', listarProdutos);               // Listar todos os produtos
router.get('/:id', buscarProduto);             // Buscar produto por ID
router.put('/:id', atualizarProduto);          // Atualizar produto por ID
router.delete('/:id', deletarProduto);         // Deletar produto por ID
router.get('/search', buscarPorNome);          // Buscar produto por nome
router.put('/:id/estoque', atualizarEstoque);  // Atualizar estoque por ID

module.exports = router;

