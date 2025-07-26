const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    meal: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Meal' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    chef: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [orderItemSchema],
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    deliveredAt: { type: Date },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
