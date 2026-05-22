const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, 'Nome do produto é obrigatório'],
        trim: true,
        minlength: [2, 'Nome deve ter pelo menos 2 caracteres']
    },
    descricao: { 
        type: String, 
        maxlength: [500, 'Descrição não pode exceder 500 caracteres']
    },
    preco: { 
        type: Number, 
        required: [true, 'Preço é obrigatório'],
        min: [0, 'Preço não pode ser negativo']
    },
    categoria: { 
        type: String, 
        required: [true, 'Categoria é obrigatória'],
        enum: ['pastel', 'bebida', 'doce', 'salgado', 'outros']
    },
    imagem: { type: String },
    emEstoque: { type: Boolean, default: true },
    quantidade: { 
        type: Number, 
        default: 0,
        min: [0, 'Quantidade não pode ser negativa']
    },
    destaque: { type: Boolean, default: false },
    ativo: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ ativo: 1 });
productSchema.index({ categoria: 1 });
productSchema.index({ nome: 1 });
productSchema.index({ nome: 'text' });

module.exports = mongoose.model('Product', productSchema);

