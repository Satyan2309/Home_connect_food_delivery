const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    type: { type: String, enum: ['home', 'work', 'other'], required: true },
    label: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    instructions: { type: String },
    isPrimary: { type: Boolean, default: false },
});

const paymentMethodSchema = new mongoose.Schema({
    type: { type: String, default: 'card' },
    cardholderName: { type: String, required: true },
    lastFour: { type: String, required: true },
    brand: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const preferencesSchema = new mongoose.Schema({
    dietaryRestrictions: [String],
    cuisinePreferences: [String],
    notifications: {
        orderUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        newChefs: { type: Boolean, default: true },
    },
});

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    // Social login fields
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    facebookId: {
        type: String,
        sparse: true,
        unique: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['customer', 'chef'],
    },
    profileImage: {
        type: String,
        default: '/assets/images/no_image.png'
    },
    phone: { type: String },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    preferences: preferencesSchema,
    // Chef-specific fields
    chefProfile: {
        title: { type: String },
        bio: { type: String },
        specialties: [String],
        rating: { type: Number, default: 0 },
        isOnline: { type: Boolean, default: false },
        verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
