const mongoose = require('mongoose');

const CompatibilityDataSchema = new mongoose.Schema({
    zodiac1: { type: String, required: true },
    zodiac2: { type: String, required: true },
    compatibilityScore: { type: Number, required: true },
    description: [{ type: String, required: true }]
});

module.exports = mongoose.model('CompatibilityData', CompatibilityDataSchema);
