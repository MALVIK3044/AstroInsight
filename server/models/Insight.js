const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    birthDetails: {
        dob: { type: Date, required: true },
        time: { type: String, required: true },
        place: { type: String, required: true }
    },
    zodiac: { type: String, required: true },
    ascendant: { type: String },
    lifePath: { type: Number, required: true },
    dosha: { type: String, required: true },
    question: { type: String }, // optional, mainly for Ask AI feature
    aiResult: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insight', InsightSchema);
