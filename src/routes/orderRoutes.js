const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const {
    criarPedido,
    listarPedidos,
    atualizarStatus,
    gerarLinkWhatsapp,
    buscarPedido,
    cancelarPedido   
} = require('../controllers/orderController');

// Rotas de pedidos
router.post('/', criarPedido);                                        // Criar pedido
router.get('/', listarPedidos);                                       // Listar pedidos
router.get('/:id', buscarPedido);                                     // Buscar pedido por ID
router.patch('/:id/status', atualizarStatus);                         // Atualizar status do pedido
router.get('/:id/whatsapp', gerarLinkWhatsapp);                       // Gerar link do WhatsApp
router.delete('/:id', auth, isAdmin, cancelarPedido);                 // Cancelar pedido (apenas administradores)

module.exports = router;




