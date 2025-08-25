const Client = require('../models/clientModel');

// Criar novo cliente
exports.criarCliente = async (req, res) => {
    try {
        const { nome, telefone } = req.body;
        if (!nome || !telefone) {
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

        // limitar campos que podem ser atualizados
        // const updateData = { nome, telefone };
        //if (req.body.endereco) updateData.endereco = req.body.endereco;

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
    if (!req.user || req.user.id.toString() !== req.params.id) {
        return res.status(403).json({ msg: 'Você só pode excluir seu próprio cadastro' });
    }

    try {
        const deletado = await Client.findByIdAndDelete(req.params.id);
        if (!deletado) return res.status(404).json({ msg: 'Cliente não encontrado' });
        res.json({ msg: 'Cliente deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao deletar cliente', erro: err.message});
    }
};

// Login de cliente (placeholder)
exports.loginCliente = async (req, res) => {
    // Implemente a lógica de autenticação aqui
    res.status(501).json({ msg: 'loginCliente não implementado' });
};

// Deletar o próprio cadastro (placeholder)
exports.deletarProprioCadastro = async (req, res) => {
    // Implemente a lógica para o cliente deletar o próprio cadastro aqui
    res.status(501).json({ msg: 'deletarProprioCadastro não implementado' });
};

