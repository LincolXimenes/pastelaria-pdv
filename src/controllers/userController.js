const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registrarUsuario = async (req, res) => {
    const { nome, email, senha, isAdmin } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ msg: 'Nome, email e senha são obrigatórios.' });
        }

        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ msg: 'Email já está em uso' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await User.create({
            nome,
            email,
            senha: senhaHash,
            isAdmin: !!isAdmin
        });

        res.status(201).json({
            _id: novoUsuario._id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            isAdmin: novoUsuario.isAdmin,
            token: gerarToken(novoUsuario._id)
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao registrar usuário', erro: err.message });
    }
};

exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
        }

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
        res.status(500).json({ msg: 'Erro no login', erro: err.message });
    }
};

exports.buscarUsuario = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar usuário', erro: err.message });
    }
};

exports.atualizarUsuario = async (req, res) => {
    try {
        const atualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!atualizado) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json(atualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar usuário', erro: err.message });
    }
};

exports.deletarUsuario = async (req, res) => {
    try {
        const deletado = await User.findByIdAndDelete(req.params.id);
        if (!deletado) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json({ msg: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar usuário', erro: err.message });
    }
};

