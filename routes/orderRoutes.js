
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {
    criarPedido,
    listarPedidos,
    atualizarStatus
} = require('../controllers/orderController');

router.post('/', criarPedido);
router.get('/', listarPedidos);
router.patch('/:id/status', atualizarStatus);

module.exports = router;

const { gerarLinkWhatsapp } = require('../controllers/orderController');
router.get('/:id/whatsapp', orderController.gerarLinkWhatsapp);




