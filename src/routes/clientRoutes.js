const express = require('express');
const router = express.Router();
const {
    criarCliente,
    listarClientes,
    buscarCliente,
    atualizarCliente,
    deletarCliente
} = require('../controllers/clientController');

// Rotas de clientes
router.post('/', criarCliente);           // Criar novo cliente
router.get('/', listarClientes);          // Listar todos os clientes
router.get('/:id', buscarCliente);        // Buscar cliente por ID
router.put('/:id', atualizarCliente);     // Atualizar cliente por ID
router.delete('/:id', deletarCliente);    // Deletar cliente por ID

module.exports = router;

