
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    preco: { type: Number, required: true },
    categoria: { type: String },
    imagem: { type: String },
    emEstoque: { type: Boolean, default: true },
    quantidade: { type: Number, default: 0 },
    destaque: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

