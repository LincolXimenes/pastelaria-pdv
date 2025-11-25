const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'gerente', 'funcionario'],
        default: 'funcionario'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
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

// Middleware para sincronizar role com isAdmin
userSchema.pre('save', function(next) {
    if (this.role === 'admin') {
        this.isAdmin = true;
    } else if (this.isAdmin) {
        this.role = 'admin';
    }
    next();
});

module.exports = mongoose.model('User', userSchema);

