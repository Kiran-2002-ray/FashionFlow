const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['Men', 'Women', 'Children'], // Limited to these categories
        required: true,
        trim: true
    },
    image_urls: [{
        type: String,
        trim: true
    }],
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports =  mongoose.model('Product', ProductSchema);
