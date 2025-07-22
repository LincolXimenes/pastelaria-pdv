
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('./api/users', userRoutes);

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado!');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });

  const clientRoutes = require('./routes/clientRoutes');
  app.use('/api/clientes', clientRoutes);

  const productRoutes = require('./routes/productRoutes');
  app.use('/api/produtos', productRoutes);

  const orderRoutes = require('./routes/orderRoutes');
  app.use('/api/pedidos', orderRoutes);

  

  