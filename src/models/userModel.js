const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, 
        required: true, 
        unique: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um email válido']
    },
    password: { type: String, required: true},
    role: { 
        type: String, 
        enum: ['admin', 'gerente', 'funcionario'], 
        default: 'funcionario' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

