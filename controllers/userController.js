

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
    return jwt.signe({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registrarUsuario = async (requestAnimationFrame, res) => {
    const { nome, email, senha, isAdmin } = requestAnimationFrame.body;

    try {
        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ msg: 'Email já está em uso' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await User.create({
            nome,
            email,
            senha: senhaHash,
            isAdmin: isAdmin || false            
        });

        res.status(201).json({
            _id: novoUsuario._id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            isAdmin: novoUsuario.isAdmin,
            token: gerarToken(novoUsuario._id)
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao registrar usuário' });
    }
};

exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ msg: 'Credenciais inválidas' });            
        }

        res.json({
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
            isAdmin: usuario.isAdmin,
            token: gerarToken(usuario._id)
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no login' });
    }
};

