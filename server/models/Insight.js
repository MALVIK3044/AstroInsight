const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  zodiacSign: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Insight = mongoose.model('Insight', insightSchema);
module.exports = Insight;
