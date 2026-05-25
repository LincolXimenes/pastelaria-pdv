const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// Importar modelos
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Product = require('../models/productModel');

// Dados de teste fixos
const testData = {
    admin: {
        nome: 'Admin Teste',
        email: 'admin@teste.com',
        senha: '123456',
        role: 'admin'
    },
    client: {
        nome: 'Cliente Teste',
        email: 'cliente@teste.com',
        senha: '123456',
        telefone: '(11) 99999-9999',
        endereco: {
            rua: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
        }
    },
    products: [
        {
            nome: 'Pastel de Carne',
            descricao: 'Delicioso pastel de carne moída',
            preco: 8.50,
            categoria: 'pastel',
            quantidade: 50,
            ativo: true,
            destaque: true
        },
        {
            nome: 'Pastel de Queijo',
            descricao: 'Pastel recheado com queijo',
            preco: 7.50,
            categoria: 'pastel',
            quantidade: 50,
            ativo: true,
            destaque: true
        },
        {
            nome: 'Refrigerante Lata',
            descricao: 'Refrigerante 350ml',
            preco: 5.00,
            categoria: 'bebida',
            quantidade: 100,
            ativo: true,
            destaque: false
        }
    ]
};

async function seedDatabase() {
    try {
        console.log('🔌 Conectando ao MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado ao MongoDB\n');

        // Limpar dados existentes de teste
        await User.deleteOne({ email: testData.admin.email });
        await Client.deleteOne({ email: testData.client.email });
        
        // Criar usuário admin de teste
        console.log('👤 Criando usuário admin de teste...');
        const hashedPasswordAdmin = await bcrypt.hash(testData.admin.senha, 10);
        const admin = await User.create({
            ...testData.admin,
            senha: hashedPasswordAdmin
        });
        console.log(`✅ Admin criado: ${admin.email} / senha: 123456\n`);

        // Criar cliente de teste
        console.log('👥 Criando cliente de teste...');
        const hashedPasswordClient = await bcrypt.hash(testData.client.senha, 10);
        const client = await Client.create({
            ...testData.client,
            senha: hashedPasswordClient
        });
        console.log(`✅ Cliente criado: ${client.email} / senha: 123456\n`);

        // Criar produtos de teste
        console.log('🥟 Criando produtos de teste...');
        for (const productData of testData.products) {
            // Verificar se já existe
            const existing = await Product.findOne({ nome: productData.nome });
            if (!existing) {
                await Product.create(productData);
                console.log(`  ✅ ${productData.nome} - R$${productData.preco}`);
            } else {
                console.log(`  ⚠️  ${productData.nome} já existe`);
            }
        }

        console.log('\n🎉 Database seed concluído com sucesso!');
        console.log('\n📝 Credenciais de teste:');
        console.log('   Admin: admin@teste.com / 123456');
        console.log('   Cliente: cliente@teste.com / 123456');
        console.log('\n🔗 Acesse: http://localhost:5000/docs\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao popular banco:', error);
        process.exit(1);
    }
}

seedDatabase();
