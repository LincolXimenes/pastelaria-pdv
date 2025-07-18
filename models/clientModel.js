
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    endereço: {
        rua: String,
        numero: String,
        complemento: String,
        bairro: String,
        cidade: String,
        estado: String,
        cep: String
    },
    observações: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);

