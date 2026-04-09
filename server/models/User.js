const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionPlan: {
        type: String,
        enum: ['Free', 'Premium'],
        default: 'Free'
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    birthDetails: {
        dob: { type: Date }, // e.g., '1995-05-15'
        time: { type: String }, // e.g., '14:30'
        place: { type: String } // e.g., 'New York'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
