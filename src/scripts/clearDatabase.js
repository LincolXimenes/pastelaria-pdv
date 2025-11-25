const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao MongoDB');
        
        await User.deleteMany({});
        console.log('✅ Usuários deletados');
        
        await Client.deleteMany({});
        console.log('✅ Clientes deletados');
        
        try {
            await Product.deleteMany({});
            console.log('✅ Produtos deletados');
        } catch (err) {
            console.log('⚠️  Produtos: coleção não existe ainda');
        }
        
        try {
            await Order.deleteMany({});
            console.log('✅ Pedidos deletados');
        } catch (err) {
            console.log('⚠️  Pedidos: coleção não existe ainda');
        }
        
        console.log('\n🎉 Banco de dados limpo com sucesso!');
        console.log('Agora você pode criar o primeiro usuário que será admin automaticamente.');
        
        process.exit(0);
    } catch (error) {
        console.error('Erro ao limpar banco:', error);
        process.exit(1);
    }
}

clearDatabase();