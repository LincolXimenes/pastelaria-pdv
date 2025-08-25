const User = require('../models/userModel');

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-senha');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao listar usuários', erro: err.message });
    }
};

// Tornar usuário admin
exports.promoverAdmin = async (req, res) => {
    try {
        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            { isAdmin: true },
            { new: true }
        );
        if (!usuario) return res.status(404).json({ msg:'Usuário não encontrado' });
        res.json({ msg: 'Usuário promovido a admin', usuario });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao promover admin', erro: err.message });
    }
};

//Remover privilégio de admin
exports.removerAdmin = async (req, res) => {
    try {
        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            { isAdmin: false },
            { new: true }
        );
        if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado' });
        res.json({ msg: 'Privilégio de admin removido', usuario });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao remover admin', erro: err.message });
    }
};

