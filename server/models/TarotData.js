const mongoose = require('mongoose');

const TarotDataSchema = new mongoose.Schema({
    cardName: { type: String, required: true },
    meaning: [{ type: String, required: true }],
    advice: [{ type: String, required: true }]
});

module.exports = mongoose.model('TarotData', TarotDataSchema);
