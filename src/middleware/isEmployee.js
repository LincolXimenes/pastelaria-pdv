module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'employee') {
        return res.status(403).json({ msg: 'Acesso restrito a funcionários' });
    }
    next();
};