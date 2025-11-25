const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_aqui';

function gerarToken(payload, expiresIn = '1d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verificarToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = {
    gerarToken,
    verificarToken
};

