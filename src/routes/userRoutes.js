const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiters');
const {
    registrarUsuario,
    loginUsuario,
    buscarUsuario,
    atualizarUsuario,
    deletarUsuario
} = require('../controllers/userController');

// Rotas públicas
router.post('/register', registerLimiter, registrarUsuario); // PÚBLICO para primeiro usuário
router.post('/login', authLimiter, loginUsuario);

// Rotas protegidas
router.get('/:id', auth, buscarUsuario);
router.put('/:id', auth, atualizarUsuario);
router.delete('/:id', auth, validateRole('admin'), deletarUsuario);

module.exports = router;

