const Compatibility = require('../models/Compatibility');
const User = require('../models/User');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate Compatibility Report
// @route   POST /api/compatibility
// @access  Private
const generateCompatibility = async (req, res) => {
  try {
    const { person2Name, person2BirthDate, person2BirthTime, person2Location, relationshipType } = req.body;

    if (!person2Name || !person2BirthDate || !relationshipType) {
      return res.status(400).json({ message: 'Name, Birth Date, and Relationship type are required' });
    }

    const user1 = await User.findById(req.user._id);
    if (!user1) return res.status(404).json({ message: 'User not found' });

    let user1Context = `${user1.name}`;
    if (user1.birthDate) {
      user1Context += ` (born ${user1.birthDate} at ${user1.birthTime || 'unknown time'} in ${user1.birthLocation || 'unknown location'})`;
    }

    let user2Context = `${person2Name} (born ${person2BirthDate} at ${person2BirthTime || 'unknown time'} in ${person2Location || 'unknown location'})`;

    const prompt = `You are an expert astrologer specializing in Synastry (compatibility). Analyze the compatibility between Person 1: ${user1Context} and Person 2: ${user2Context}. Focus the reading on a ${relationshipType} relationship. Keep the analysis to 3 highly insightful, glowing, and cosmic paragraphs. Avoid overly clinical language, make it enchanting and modern.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are AstroInsight's master synastry astrologer." },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const reportText = completion.choices[0].message.content;

    const report = await Compatibility.create({
      user1: req.user._id,
      person2Name,
      person2BirthDate,
      person2BirthTime,
      person2Location,
      relationshipType,
      aiReport: reportText
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Compatibility error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Compatibility History
// @route   GET /api/compatibility
// @access  Private
const getCompatibilityHistory = async (req, res) => {
  try {
    const history = await Compatibility.find({ user1: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateCompatibility, getCompatibilityHistory };
