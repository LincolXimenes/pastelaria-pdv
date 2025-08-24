module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ msg: 'Acesso restrito a clientes' });
    }
    next();
};