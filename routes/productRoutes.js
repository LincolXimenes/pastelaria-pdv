
const express = require('express');
const router = express.Router();
const {
    criarProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    deletarProduto
} = require('../controllers/productController');

router.post('/', criarProduto);
router.get('/', listarProdutos);
router.get('/', buscarProduto);
router.put('/', atualizarProduto);
router.delete('/', deletarProduto);

module.exports = router;

