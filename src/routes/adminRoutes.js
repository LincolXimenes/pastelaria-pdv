const express = require('express');
const router = express.Router();
const {listarUsuarios, promoverAdmin, removerAdmin } = require('../controllers/adminController');
