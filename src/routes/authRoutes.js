const express = require('express');
const router = express.Router();
const { loginUsuario, registrarUsuario } = require('../controllers/userController');
router.post('/login', loginUsuario);
router.post('/register', registrarUsuario);


// const { login } = require('../controllers/authController');
// Login e Registro (comum a todos)
// router.post('/login', login);

module.exports = router;

