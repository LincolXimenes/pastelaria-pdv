const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { loginUsuario, registrarUsuario } = require('../controllers/authController');

// Login e Registro (comum a todos)
router.post('/login', login);
router.post('/login', loginUsuario);
router.post('/register', registrarUsuario);

module.exports = router;

