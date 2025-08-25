const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Carregar variáveis de ambiente
dotenv.config();
const swaggerDocument = YAML.load('./swagger.yaml');

// Inicializar o app
const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rotas da documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importação das rotas
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/pedidos', orderRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API Pastelaria PDV rodando!');
});

// Rota para não encontrados
app.use((req, res) => {
  res.status(404).json({ msg: 'Rota não encontrada' });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ msg: 'Erro interno do servidor', erro: err.message });
});

const PORT = process.env.PORT || 5000;

// Verificação de variáveis de ambientes essenciais
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI não definida no .env');
  process.exit(1);
}
if(!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET não definida no .env. Usando valor padrão inseguro!');
}

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });





