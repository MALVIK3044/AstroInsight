const Chat = require('../models/Chat');
const User = require('../models/User');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Send message to AI Astrologer
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Save user message to DB
    await Chat.create({
      user: req.user._id,
      role: 'user',
      content: message
    });

    // Fetch user details for context
    const user = await User.findById(req.user._id);
    let systemContext = "You are AstroInsight's AI Astrologer. You provide concise, mystical yet practical life advice based on astrology.";
    
    if (user && user.birthDate) {
      systemContext += ` The user speaking to you was born on ${user.birthDate} at ${user.birthTime || 'unknown time'} in ${user.birthLocation || 'unknown location'}. Use this info implicitly to tailor your advice. Respond concisely in 1-2 paragraphs max.`;
    }

    // Fetch recent chat history for context (last 6 messages)
    const history = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(6);
    const messagesContext = history.reverse().map(msg => ({
      role: msg.role === 'astrologer' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Combine system prompt + history + current message
    const apiMessages = [
      { role: "system", content: systemContext },
      ...messagesContext
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponseText = completion.choices[0].message.content;

    // Save AI response to DB
    const aiMessage = await Chat.create({
      user: req.user._id,
      role: 'astrologer',
      content: aiResponseText
    });

    res.status(201).json(aiMessage);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to communicate with the stars: ' + error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chat
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const messages = await Chat.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatHistory };
