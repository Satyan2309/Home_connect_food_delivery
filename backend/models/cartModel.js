const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    meal: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Meal' 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
    },
    price: { 
        type: Number, 
        required: true 
    },
    specialInstructions: { 
        type: String, 
        default: '' 
    }
});

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    items: [cartItemSchema],
    promoCode: {
        code: { type: String },
        discount: { type: Number },
        expiryDate: { type: Date }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Cart documents will be automatically deleted after 7 days
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating total price
cartSchema.virtual('totalPrice').get(function() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

module.exports = mongoose.model('Cart', cartSchema);