const jwt = require('jsonwebtoken');

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET não definida no ambiente');
    }

    return secret;
}

function gerarToken(payload, expiresIn = '1d') {
    return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

function verificarToken(token) {
    try {
        return jwt.verify(token, getJwtSecret());
    } catch (err) {
        return null;
    }
}

module.exports = {
    gerarToken,
    verificarToken
};

