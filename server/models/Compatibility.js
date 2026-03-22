const mongoose = require('mongoose');

const compatibilitySchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  person2Name: {
    type: String,
    required: true,
  },
  person2BirthDate: {
    type: String,
    required: true,
  },
  person2BirthTime: {
    type: String,
  },
  person2Location: {
    type: String,
  },
  relationshipType: {
    type: String, // 'Romantic', 'Friendship', 'Business'
    required: true,
  },
  aiReport: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Compatibility', compatibilitySchema);
