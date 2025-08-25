const User = require('../models/userModel');
const Client = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const gerarToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Login para cliente ou usuário
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        let user = await User.findOne({ email });
        let role = 'user';

        if (!user) {
            user = await Client.findOne({ email });
            role = 'client';
        }

        if (!user) return res.status(400).json({ msg: 'Usuário/Cliente não encontrado' });

        const match = await bcrypt.compare(senha, user.senha);
        if (!match) return res.status(401).json({ msg: 'Senha inválida'});

        res.json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            role,
            token: gerarToken(user._id, role)
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no login', erro: err.message });
    }
};