const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Carregar variáveis de ambiente
dotenv.config();
const swaggerDocument = YAML.load('./swagger.yaml');

// Inicializar o app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importação das rotas
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Definir rotas
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', userRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/pedidos', orderRoutes);

// Porta
const PORT = process.env.PORT || 3000;

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



  

  