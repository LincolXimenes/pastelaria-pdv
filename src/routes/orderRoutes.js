const express = require('express');
const router = express.Router();
const {
    criarPedido,
    listarPedidos,
    atualizarStatus,
    gerarLinkWhatsapp,
    buscarPedido
} = require('../controllers/orderController');

// Rotas de pedidos
router.post('/', criarPedido);                       // Criar pedido
router.get('/', listarPedidos);                      // Listar pedidos
router.get('/:id', buscarPedido);                    // Buscar pedido por ID
router.patch('/:id/status', atualizarStatus);        // Atualizar status do pedido
router.get('/:id/whatsapp', gerarLinkWhatsapp);      // Gerar link do WhatsApp

module.exports = router;




