const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {type: String, required:  true},
    phone: { type: String, required: true },
    address: {
        street: String,
        number: String,
        complement: String,
        neighborhood: String,
        city: String,
        state: String,
        zip: String
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);

