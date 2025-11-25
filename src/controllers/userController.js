const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { gerarToken } = require('../utils/tokenUtils'); // USAR O UTILITÁRIO

// Registrar usuário
exports.registrarUsuario = async (req, res) => {
    const { nome, email, senha, isAdmin } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ msg: 'Nome, email e senha são obrigatórios.' });
        }

        const totalUsuarios = await User.countDocuments();
        const isFirstUser = totalUsuarios === 0;

        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ msg: 'Email já está em uso' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await User.create({
            nome,
            email,
            senha: senhaHash,
            isAdmin: isFirstUser ? true : !!isAdmin,
            role: isFirstUser ? 'admin' : (isAdmin ? 'admin' : 'funcionario')
        });

        // USAR tokenUtils unificado
        const token = gerarToken({
            id: novoUsuario._id,
            email: novoUsuario.email,
            role: novoUsuario.role,
            isAdmin: novoUsuario.isAdmin
        });

        res.status(201).json({
            _id: novoUsuario._id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            isAdmin: novoUsuario.isAdmin,
            role: novoUsuario.role,
            token
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao registrar usuário', erro: err.message });
    }
};

// Login usuário
exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
        }

        const usuario = await User.findOne({ email }).select('+senha');
        
        if (!usuario) {
            return res.status(401).json({ msg: 'Credenciais inválidas' });
        }

        if (!usuario.senha) {
            return res.status(500).json({ msg: 'Erro na configuração do usuário' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ msg: 'Credenciais inválidas' });
        }

        // USAR tokenUtils unificado
        const token = gerarToken({
            id: usuario._id,
            email: usuario.email,
            role: usuario.role,
            isAdmin: usuario.isAdmin
        });

        res.json({
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
            isAdmin: usuario.isAdmin,
            role: usuario.role,
            token
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ msg: 'Erro no login', erro: err.message });
    }
};

// Buscar usuário por ID
exports.buscarUsuario = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar usuário', erro: err.message });
    }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.senha) {
            updateData.senha = await bcrypt.hash(updateData.senha, 10);
        }
        delete updateData._id;

        const atualizado = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-senha');
        if (!atualizado) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json(atualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar usuário', erro: err.message });
    }
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
    try {
        const deletado = await User.findByIdAndDelete(req.params.id);
        if (!deletado) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json({ msg: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar usuário', erro: err.message });
    }
};

