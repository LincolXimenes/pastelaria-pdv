const mongoose = require('mongoose');

const idempotencyKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true,
        maxlength: 128
    },
    endpoint: {
        type: String,
        required: true
    },
    requestHash: {
        type: String,
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

idempotencyKeySchema.index({ key: 1, endpoint: 1 }, { unique: true });
idempotencyKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('IdempotencyKey', idempotencyKeySchema);