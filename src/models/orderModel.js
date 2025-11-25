const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: [1, 'Quantidade deve ser pelo menos 1']
    },
    precoUnitario: {
        type: Number,
        required: true,
        min: [0, 'Preço unitário não pode ser negativo']
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal não pode ser negativo']
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Cliente é obrigatório']
    },
    produtos: [itemPedidoSchema],
    total: {
        type: Number,
        required: true,
        min: [0, 'Total não pode ser negativo']
    },
    status: {
        type: String,
        enum: ['pendente', 'em preparação', 'pronto', 'enviado', 'concluído', 'cancelado'],
        default: 'pendente'
    },
    metodoEntrega: {
        type: String,
        enum: ['retirada', 'entrega'],
        required: [true, 'Método de entrega é obrigatório']
    },
    taxaEntrega: {
        type: Number,
        default: 0,
        min: [0, 'Taxa de entrega não pode ser negativa']
    },
    enderecoEntrega: {
        rua: String,
        numero: String,
        complemento: String,
        bairro: String,
        cidade: String,
        estado: String,
        cep: String
    },
    observacoes: { type: String, maxlength: 500 },
    dataEntrega: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);