const mongoose = require('mongoose');

const enderecoSchema = new mongoose.Schema({
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true, match: /^\d{5}-?\d{3}$/ }
}, { _id: false });

const clientSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [2, 'Nome deve ter pelo menos 2 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
    },
    telefone: { 
        type: String, 
        required: [true, 'Telefone é obrigatório'],
        match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/, 'Formato de telefone inválido']
    },
    endereco: enderecoSchema,
    observacoes: { type: String, maxlength: 500 },
    ativo: { type: Boolean, default: true }
}, { 
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            delete ret.senha;
            return ret;
        }
    }
});

module.exports = mongoose.model('Client', clientSchema);

