const mongoose = require('mongoose');

const ZodiacInsightSchema = new mongoose.Schema({
    zodiac: { type: String, required: true },
    personality: [{ type: String, required: true }],
    career: [{ type: String, required: true }],
    love: [{ type: String, required: true }],
    health: [{ type: String, required: true }]
});

module.exports = mongoose.model('ZodiacInsight', ZodiacInsightSchema);
