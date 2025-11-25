function validateRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'Usuário não autenticado' });
        }

        // Usar role do token, fallback para isAdmin
        const userRole = req.user.role || (req.user.isAdmin ? 'admin' : 'funcionario');
        
        // Admins têm acesso a tudo
        if (req.user.isAdmin || userRole === 'admin') {
            return next();
        }

        // Verificar se role está nas permitidas
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                msg: 'Acesso negado. Permissão insuficiente.',
                requiredRoles: allowedRoles,
                userRole
            });
        }

        next();
    };
}

module.exports = validateRole;
