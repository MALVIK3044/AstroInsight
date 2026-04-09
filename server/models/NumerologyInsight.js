const mongoose = require('mongoose');

const NumerologyInsightSchema = new mongoose.Schema({
    lifePathNumber: { type: Number, required: true },
    traits: [{ type: String, required: true }],
    strengths: [{ type: String, required: true }],
    weaknesses: [{ type: String, required: true }]
});

module.exports = mongoose.model('NumerologyInsight', NumerologyInsightSchema);
