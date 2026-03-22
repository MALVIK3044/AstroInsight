const Insight = require('../models/Insight');
const User = require('../models/User');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate new AI insight
// @route   POST /api/insight/generate
// @access  Private
const generateInsight = async (req, res) => {
  try {
    const { zodiacSign, domain } = req.body;

    if (!zodiacSign || !domain) {
      return res.status(400).json({ message: 'Zodiac sign and domain are required' });
    }

    // Fetch user to get birth details
    const user = await User.findById(req.user._id);
    let birthContext = "";
    if (user && user.birthDate) {
      birthContext = ` The user was born on ${user.birthDate} at ${user.birthTime || 'an unknown time'} in ${user.birthLocation || 'an unknown location'}. Please factor their precise birth data into this astrological reading.`;
    }

    const prompt = `You are a wise, empathetic, and expert astrologer. Generate a personalized, insightful, and uplifting life guidance reading for a person whose zodiac sign is ${zodiacSign}, focusing specifically on the domain of ${domain}.${birthContext} Keep the response around 3-4 short paragraphs, written in a modern, engaging, and cosmic tone without being overly mystical. Format with clear spacing.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional AI Astrologer." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponseText = completion.choices[0].message.content;

    const insight = await Insight.create({
      user: req.user._id,
      zodiacSign,
      domain,
      aiResponse: aiResponseText,
    });

    res.status(201).json(insight);
  } catch (error) {
    console.error('Error generating insight:', error);
    res.status(500).json({ message: 'Error generating insight: ' + error.message });
  }
};

// @desc    Get user insight history
// @route   GET /api/insight/history
// @access  Private
const getInsightHistory = async (req, res) => {
  try {
    const insights = await Insight.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateInsight, getInsightHistory };
