
const Client = require('../models/clientModel');

// Criar novo cliente
exports.criarCliente = async (req, res) => { 
    try {
        const cliente = await Client.create(req.body);
        res.status(201).json(cliente);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao cadastrar cliente', erro: err.message })
    }
};

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Client.find().sort({ createdAT: -1 });
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar clientes' });
    }
};

// Buscar cliente por ID
exports.buscarCliente = async (req, res) => {
    try {
        const cliente = await Client.findById(req.params.id);
        if (!cliente) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json(cliente);
        } catch (err) {
            res.status(500).json({ msg: 'Erro ao buscar cliente' });
        }    
    };
// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
    try {
        const clienteAtualizado = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!clienteAtualizado) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json(clienteAtualizado);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao atualizar cliente' });
    }
};

// Deletar cliente
exports.deletarCliente = async (req, res) => {
    try {
        const clienteDeletado = await Client.findByIdAndDelete(req.params.id);
        if (!clienteDeletado) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json({ msg: 'Cliente deletado com sucesso' });  
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar cliente' });
    }   
};

