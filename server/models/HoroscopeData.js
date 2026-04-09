const mongoose = require('mongoose');

const HoroscopeDataSchema = new mongoose.Schema({
    zodiac: { type: String, required: true },
    daily: [{ type: String, required: true }],
    monthly: [{ type: String, required: true }]
});

module.exports = mongoose.model('HoroscopeData', HoroscopeDataSchema);
