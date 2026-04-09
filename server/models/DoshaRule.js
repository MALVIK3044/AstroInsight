const mongoose = require('mongoose');

const DoshaRuleSchema = new mongoose.Schema({
    condition: { type: String, required: true }, // e.g. "High Mangal Dosha Present"
    result: { type: String, required: true },
    remedy: [{ type: String, required: true }]
});

module.exports = mongoose.model('DoshaRule', DoshaRuleSchema);
