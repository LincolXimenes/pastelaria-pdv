

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    produtos: [
        {
            produto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantidade: { type: Number, required: true }
        }
    ],
    metodoEntrega: {
        type: String,
        enum: ['retirada', 'entrega'],
        required: true
    },
    taxaEntrega: { type: Number, default: 0 },
    total: { type: Number },
    status: {
        type: String,
        enum: ['pendente', 'em preparação', 'pronto', 'enviado', 'concluído'],
        default: 'pendente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);