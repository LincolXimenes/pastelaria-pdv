const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
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

// Apenas o próprio cliente autenticado pode acessar
router.get('/me', auth, validateRole('cliente'), buscarCliente);
router.put('/me', auth, validateRole('cliente'), atualizarCliente);
router.delete('/me', auth, validateRole('cliente'), deletarProprioCadastro);

// Rotas administrativas
router.get('/', auth, validateRole('admin'), listarClientes);
router.get('/:id', auth, validateRole('admin'), buscarCliente);
router.put('/:id', auth, validateRole('admin'), atualizarCliente);
router.delete('/:id', auth, validateRole('admin'), deletarCliente);

module.exports = router;

