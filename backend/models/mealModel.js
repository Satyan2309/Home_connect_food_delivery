const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    chef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    category: { type: String, required: true },
    prepTime: { type: Number, required: true }, // in minutes
    serves: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    ingredients: [String],
    dietaryTags: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Meal', mealSchema);
