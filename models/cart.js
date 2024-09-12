const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit_price: { type: Number, required: true },
        },
    ],
    total_price: { type: Number, required: true },
    updated_at: { type: Date, default: Date.now },
});

module.exports =  mongoose.model('Cart', cartSchema);
