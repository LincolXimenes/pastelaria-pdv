
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'O preço não pode ser negativo']
    },
    category: { type: String },
    image: { type: String },
    inStock: { type: Boolean, default: true },
    quantity: { 
        type: Number, 
        default: 0,
        min: [0, 'A quantidade não pode ser negativa']
    },
    highlight: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

