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

router.post('/register', auth, validateRole('admin'), registrarUsuario);      // Registrar novo usuário
router.post('/login', loginUsuario);                                          // Login de usuário
router.get('/:id', auth, buscarUsuario);                                      // Buscar usuário por ID
router.put('/:id', auth, atualizarUsuario);                                 // Atualizar usuário por ID
router.delete('/:id', auth, validateRole('admin'), deletarUsuario);           // Deletar usuário por ID

module.exports = router;

