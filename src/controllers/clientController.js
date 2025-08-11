const Client = require('../models/clientModel');

// Criar novo cliente
exports.criarCliente = async (req, res) => {
    try {
        const { nome, telefone } = req.body;
        if (!nome.trim() || !telefone.trim()) {
            return res.status(400).json({ msg: 'Nome e telefone são obrigatórios.' });
        }
        const cliente = await Client.create(req.body);
        res.status(201).json(cliente);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao cadastrar cliente', erro: err.message });
    }
};

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Client.find().sort({ createdAt: -1 });
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar clientes', erro: err.message });
    }
};

// Buscar cliente por ID
exports.buscarCliente = async (req, res) => {
    try {
        const cliente = await Client.findById(req.params.id);
        if (!cliente) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar cliente', erro: err.message });
    }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
    try {
        const { nome, telefone } = req.body;
        if (!nome || !telefone) {
            return res.status(400).json({ msg: 'Nome e telefone são obrigatórios.' });
        }
        const clienteAtualizado = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!clienteAtualizado) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json(clienteAtualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar cliente', erro: err.message });
    }
};

// Deletar cliente
exports.deletarCliente = async (req, res) => {
    try {
        const clienteDeletado = await Client.findByIdAndDelete(req.params.id);
        if (!clienteDeletado) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json({ msg: 'Cliente deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar cliente', erro: err.message });
    }
};


