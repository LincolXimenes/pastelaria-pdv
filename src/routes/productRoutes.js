const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
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
router.post('/', auth, validateRole('admin', 'funcionario'), criarProduto);                    // Criar novo produto
router.get('/', listarProdutos);                                                               // Listar todos os produtos
router.get('/search', buscarPorNome);                                                           // Buscar produto por nome
router.get('/:id', buscarProduto);                                                             // Buscar produto por ID
router.put('/:id', auth, validateRole('admin', 'funcionario'), atualizarProduto);              // Atualizar produto por ID
router.put('/:id/estoque', auth, validateRole('admin', 'funcionario'), atualizarEstoque);    // Atualizar estoque por ID
router.delete('/:id', auth, validateRole('admin'), deletarProduto);                           // Deletar produto por ID

module.exports = router;

