const { verificarToken } = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ msg: 'Token de acesso requerido' });
    }

    const decoded = verificarToken(token);
    
    if (!decoded) {
        return res.status(401).json({ msg: 'Token inválido' });
    }

    req.user = decoded;
    next();
}

module.exports = authMiddleware;

