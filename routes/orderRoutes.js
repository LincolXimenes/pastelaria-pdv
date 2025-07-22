
const express = require('express');
const router = express.Router();
const {
    criarPedido,
    listarPedidos,
    atualizarStatus
} = require('../controller/orderController');

router.post('/', criarPedido);
router.get('/', listarPedidos);
router.patch('/:id/status', atualizarStatus);

module.exports = router;

router.get('/:id/whatsapp', gerarLinkWhatsapp);




