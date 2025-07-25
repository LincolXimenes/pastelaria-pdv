const express = require('express');
const router = express.Router();
const {
    registrarUsuario,
    loginUsuario,
    buscarUsuario,
    atualizarUsuario,
    deletarUsuario
} = require('../controllers/userController');

router.post('/register', registrarUsuario);      // Registrar novo usuário
router.post('/login', loginUsuario);             // Login de usuário
router.get('/:id', buscarUsuario);               // Buscar usuário por ID
router.put('/:id', atualizarUsuario);            // Atualizar usuário por ID
router.delete('/:id', deletarUsuario);           // Deletar usuário por ID

module.exports = router;

