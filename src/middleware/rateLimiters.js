const { rateLimit } = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
    }
});

const createOrderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: 'Muitas tentativas de criação de pedido. Tente novamente em alguns minutos.'
    }
});

module.exports = {
    authLimiter,
    createOrderLimiter
};