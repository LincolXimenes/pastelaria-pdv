const User = require('../models/userModel');
const Client = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendServerError } = require('../utils/errorUtils');

const gerarToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Login para cliente ou usuário
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        let user = await User.findOne({ email }).select('+senha');
        let role = 'funcionario';

        if (!user) {
            user = await Client.findOne({ email }).select('+senha');
            role = 'cliente';
        } else {
            role = user.role;
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
        sendServerError(res, 'Erro no login', err);
    }
};