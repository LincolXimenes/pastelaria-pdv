const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
const {
    criarProduto,
    listarProdutos,
    buscarProduto,
    buscarPorNome,
    atualizarProduto,
    atualizarEstoque,
    deletarProduto
} = require('../controllers/productController');

// Rotas públicas
router.get('/', listarProdutos);           // Listar produtos
router.get('/search', buscarPorNome);      // Buscar por nome
router.get('/:id', buscarProduto);         // Buscar por ID

// Rotas protegidas (admin/funcionário)
router.post('/', auth, validateRole('admin', 'funcionario'), criarProduto);
router.put('/:id', auth, validateRole('admin', 'funcionario'), atualizarProduto);
router.put('/:id/estoque', auth, validateRole('admin', 'funcionario'), atualizarEstoque);

// Rotas apenas admin
router.delete('/:id', auth, validateRole('admin'), deletarProduto);

module.exports = router;

