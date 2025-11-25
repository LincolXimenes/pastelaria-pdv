const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
const {
    registrarUsuario,
    loginUsuario,
    buscarUsuario,
    atualizarUsuario,
    deletarUsuario
} = require('../controllers/userController');

// Rotas públicas
router.post('/register', registrarUsuario); // PÚBLICO para primeiro usuário
router.post('/login', loginUsuario);

// Rotas protegidas
router.get('/:id', auth, buscarUsuario);
router.put('/:id', auth, atualizarUsuario);
router.delete('/:id', auth, validateRole('admin'), deletarUsuario);

module.exports = router;

