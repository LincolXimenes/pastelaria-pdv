const allowedOrigins = [
    'http://localhost:5173', 
    //adicione outros domínios permitidos
];

const corsOptions = {
    origin: function (origin, callback) {
        // permite requisições sem origin (ex: Postman) ou de origens permititdas
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo Cors'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATcH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

module.exports = corsOptions;

