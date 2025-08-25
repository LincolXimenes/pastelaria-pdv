const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'seu segredo aqui'; 

const gerarToken = (id, isAdmin = false) => {
    return jwt.sign({ is, isAdmin }, JWT_SECRET, { expiresIn: '1d' });
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
            token: gerarToken(novoUsuario._id, novoUsuario.isAdmin)
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
            token: gerarToken(usuario._id, usuario.isAdmin)
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
        const updateData = { ...req.body };
        // se for atualizar a senha, faça o hash
        if (updateData.senha) {
            updateData.senha = await bcrypt.hash(updateData.senha, 10);
        }
        // nunca permita atualizar o campo _id
        delete updateData._id;

        const atualizado = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-senha');
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

