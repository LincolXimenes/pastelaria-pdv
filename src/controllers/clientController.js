const Client = require('../models/clientModel');
const bcrypt = require('bcryptjs'); // ou 'bcrypt' se instalou a primeira versão
const { gerarToken } = require('../utils/tokenUtils');

// Criar novo cliente
exports.criarCliente = async (req, res) => {
    try {
        const { nome, email, senha, telefone } = req.body;
        
        if (!nome || !email || !senha || !telefone) {
            return res.status(400).json({ msg: 'Nome, email, senha e telefone são obrigatórios.' });
        }

        // Verificar se cliente já existe
        const clienteExistente = await Client.findOne({ email });
        if (clienteExistente) {
            return res.status(400).json({ msg: 'Email já está em uso.' });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        const clienteData = {
            ...req.body,
            senha: hashedPassword
        };

        const cliente = await Client.create(clienteData);
        res.status(201).json(cliente);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao cadastrar cliente', erro: err.message });
    }
};

// Login de cliente
exports.loginCliente = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
        }

        // Buscar cliente com senha
        const cliente = await Client.findOne({ email }).select('+senha');
        if (!cliente) {
            return res.status(401).json({ msg: 'Credenciais inválidas.' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, cliente.senha);
        if (!senhaValida) {
            return res.status(401).json({ msg: 'Credenciais inválidas.' });
        }

        // Gerar token
        const token = gerarToken({
            id: cliente._id,
            email: cliente.email,
            role: 'cliente'
        });

        res.json({
            msg: 'Login realizado com sucesso',
            token,
            cliente: {
                id: cliente._id,
                nome: cliente.nome,
                email: cliente.email
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no login', erro: err.message });
    }
};

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Client.find({ ativo: true }).sort({ createdAt: -1 });
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar clientes', erro: err.message });
    }
};

// Buscar cliente por ID
exports.buscarCliente = async (req, res) => {
    try {
        let clienteId;
        
        // Se for rota /me, usar ID do token
        if (req.route.path === '/me') {
            clienteId = req.user.id;
        } else {
            clienteId = req.params.id;
        }

        const cliente = await Client.findById(clienteId);
        if (!cliente || !cliente.ativo) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }
        
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar cliente', erro: err.message });
    }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
    try {
        let clienteId;
        
        // Se for rota /me, usar ID do token
        if (req.route.path === '/me') {
            clienteId = req.user.id;
        } else {
            clienteId = req.params.id;
        }

        const { senha, ...updateData } = req.body;

        // Se senha foi fornecida, criptografar
        if (senha) {
            updateData.senha = await bcrypt.hash(senha, 10);
        }

        const clienteAtualizado = await Client.findByIdAndUpdate(
            clienteId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!clienteAtualizado) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        res.json(clienteAtualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar cliente', erro: err.message });
    }
};

// Deletar cliente (admin)
exports.deletarCliente = async (req, res) => {
    try {
        const clienteDeletado = await Client.findByIdAndUpdate(
            req.params.id,
            { ativo: false },
            { new: true }
        );

        if (!clienteDeletado) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        res.json({ msg: 'Cliente desativado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar cliente', erro: err.message });
    }
};

// Deletar próprio cadastro
exports.deletarProprioCadastro = async (req, res) => {
    try {
        const clienteDeletado = await Client.findByIdAndUpdate(
            req.user.id,
            { ativo: false },
            { new: true }
        );

        if (!clienteDeletado) {
            return res.status(404).json({ msg: 'Cliente não encontrado' });
        }

        res.json({ msg: 'Cadastro removido com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar cadastro', erro: err.message });
    }
};

