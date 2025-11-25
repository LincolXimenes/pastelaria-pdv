const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',   // Adicionar para React comum
    'http://localhost:5000',   // Adicionar para testes locais
    'http://127.0.0.1:5000',   // Adicionar para cURL/Postman
    //adicione outros domínios permitidos
];

const corsOptions = {
    origin: function (origin, callback) {
        // permite requisições sem origin (ex: Postman) ou de origens permitidas
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo Cors'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Corrigir 'PATcH' para 'PATCH'
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

module.exports = corsOptions;

