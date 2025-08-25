const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
const isClient = require('../middleware/isClient');
const isAdmin = require('../middleware/isAdmin')
const {
    criarCliente,
    loginCliente,
    buscarCliente,
    listarClientes,
    atualizarCliente,
    deletarCliente,
    deletarProprioCadastro
} = require('../controllers/clientController');

// Cadastro e login (públicos)
router.post('/register', criarCliente);
router.post('/login', loginCliente);

//Apenas o próprio cliente autenticado pode acessar ou excluir
router.get('/me', auth, validateRole('client'), buscarCliente);
router.put('/me', auth, validateRole('client'), atualizarCliente);
router.delete('/me', auth, validateRole('client'), deletarProprioCadastro);

// Rotas administrativas
router.get('/', auth, validateRole('admin'), listarClientes);        // Listar todos os clientes
router.get('/:id', auth, validateRole('admin'), buscarCliente);      // Buscar cliente por ID
router.put('/:id', auth, validateRole('admin'), atualizarCliente);   // Atualizar cliente por ID
router.delete('/:id', auth, validateRole('admin'), deletarCliente);  // Deletar cliente por ID

module.exports = router;

