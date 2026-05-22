const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
const { createOrderLimiter } = require('../middleware/rateLimiters');
const {
    criarPedido,
    listarPedidos,
    buscarPedido,
    atualizarStatusPedido,
    deletarPedido,
    gerarWhatsApp
} = require('../controllers/orderController');

// Criar pedido (público/cliente)
router.post('/', createOrderLimiter, criarPedido);                                        // Criar pedido

// Rotas autenticadas
router.get('/', auth, validateRole('admin', 'funcionario'), listarPedidos);                                       // Listar pedidos
router.get('/:id', auth, buscarPedido);                                     // Buscar pedido por ID
router.patch('/:id/status', auth, validateRole('admin', 'funcionario'), atualizarStatusPedido);                         // Atualizar status do pedido
router.get('/:id/whatsapp', auth, gerarWhatsApp);                       // Gerar link do WhatsApp

// Apenas admin pode deletar
router.delete('/:id', auth, validateRole('admin'), deletarPedido);                 // Cancelar pedido (apenas administradores)

module.exports = router;




