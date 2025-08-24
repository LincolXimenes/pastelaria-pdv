const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true},
    role: { type: String, enum: ['admin', 'gerente', 'funcionario'], default: 'funcionario' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

