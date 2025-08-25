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

// Criar pedido (público autenticado)
router.post('/', criarPedido);                                        // Criar pedido

// Listar todos os pedidos (apenas admin)
router.get('/', auth, isAdmin, listarPedidos);                                       // Listar pedidos

// Buscar pedido por ID (autenticado)
router.get('/:id', auth, buscarPedido);                                     // Buscar pedido por ID

// Atualizar status do pedido (autenticado)
router.patch('/:id/status', auth, atualizarStatus);                         // Atualizar status do pedido

// Gerar Link do Whatsapp (autenticado)
router.get('/:id/whatsapp', auth, gerarLinkWhatsapp);                       // Gerar link do WhatsApp

// Cancelar pedido (apenas admin)
router.delete('/:id', auth, isAdmin, cancelarPedido);                 // Cancelar pedido (apenas administradores)

module.exports = router;




