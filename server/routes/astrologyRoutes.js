const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Insight = require('../models/Insight');
const User = require('../models/User');
const { getZodiacSign, getLifePathNumber, getMulankNumber, getAscendant, checkMangalDosha, generatePlanetPositions } = require('../utils/astrologyLogic');
const { generateKundli, generateHoroscope, generateCompatibility, generateAskAI, generateTarot } = require('../services/databaseAstrologyService');

// @route   POST /api/astrology/kundli
// @desc    Generate Kundli & save insight (Offline Database Driven)
// @access  Private
router.post('/kundli', auth, async (req, res) => {
    const { dob, time, place } = req.body;
    if (!dob || !time || !place) return res.status(400).json({ msg: 'Please provide dob, time, and place' });

    try {
        const zodiac = getZodiacSign(dob);
        const ascendant = getAscendant(dob, time);
        const lifePath = getLifePathNumber(dob);
        const dosha = checkMangalDosha(dob, time);

        const aiResult = await generateKundli(zodiac, lifePath, dosha);

        const newInsight = new Insight({
            userId: req.user.id,
            birthDetails: { dob, time, place },
            zodiac,
            ascendant,
            lifePath,
            dosha,
            question: "Full Kundli Reading",
            aiResult // This is now a structured JSON object
        });

        await newInsight.save();
        
        const planets = generatePlanetPositions(dob, time);
        res.json({ ...newInsight.toObject(), planets });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/astrology/horoscope
// @desc    Get horoscope for zodiac sign (Offline Database Driven)
// @access  Public or Private
router.get('/horoscope', async (req, res) => {
    const { sign, timeframe } = req.query; // timeframe: 'daily' or 'monthly'
    try {
        if (!sign) return res.status(400).json({ msg: 'Zodiac sign required' });
        
        const timeFrameStr = timeframe || 'daily';
        let aiResult = await generateHoroscope(sign, timeFrameStr);

        res.json({ sign, timeframe: timeFrameStr, aiResult });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/astrology/numerology
// @desc    Calculate life path
// @access  Public
router.post('/numerology', (req, res) => {
    const { dob, name } = req.body;
    if (!dob) return res.status(400).json({ msg: 'Please provide dob' });
    try {
        const lifePath = getLifePathNumber(dob);
        const mulank = getMulankNumber(dob);
        res.json({ name, dob, lifePath, mulank });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/astrology/dosha
// @desc    Check dosha
// @access  Public
router.post('/dosha', (req, res) => {
    const { dob, time } = req.body;
    if (!dob || !time) return res.status(400).json({ msg: 'Please provide dob and time' });
    try {
        const ascendant = getAscendant(dob, time);
        const dosha = checkMangalDosha(dob, time);
        res.json({ dob, time, ascendant, dosha });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/astrology/ask-ai
// @desc    Ask a unique question (Offline DB variations)
// @access  Private
router.post('/ask-ai', auth, async (req, res) => {
    const { question, dob, time, place } = req.body;
    if (!question || !dob || !time || !place) return res.status(400).json({ msg: 'Please provide question, dob, time, and place' });
    try {
        const user = await User.findById(req.user.id);
        if (user.subscriptionPlan !== 'Premium') {
            const questionCount = await Insight.countDocuments({ 
                userId: req.user.id, 
                question: { $exists: true, $ne: 'Full Kundli Reading' } 
            });
            if (questionCount >= 3) {
                return res.status(403).json({ msg: 'Free tier limit reached! Contact admin to upgrade your account to Premium for unlimited queries.' });
            }
        }

        const zodiac = getZodiacSign(dob);
        const ascendant = getAscendant(dob, time);
        const lifePath = getLifePathNumber(dob);
        const dosha = checkMangalDosha(dob, time);

        const aiResult = await generateAskAI(question, zodiac, lifePath);

        const newInsight = new Insight({
            userId: req.user.id,
            birthDetails: { dob, time, place },
            zodiac,
            ascendant,
            lifePath,
            dosha,
            question,
            aiResult
        });

        await newInsight.save();
        res.json(newInsight);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/astrology/match
// @desc    Calculate compatibility match (Offline DB variations)
// @access  Private
router.post('/match', auth, async (req, res) => {
    const { person1, person2 } = req.body;
    if (!person1 || !person2 || !person1.dob || !person2.dob) {
        return res.status(400).json({ msg: 'Please provide required birth details for both individuals' });
    }

    try {
        const zodiac1 = getZodiacSign(person1.dob);
        const zodiac2 = getZodiacSign(person2.dob);

        const compResult = await generateCompatibility(zodiac1, zodiac2);
        const aiResult = `Compatibility Score: ${compResult.score}/100\n\n${compResult.description}`;

        const newInsight = new Insight({
            userId: req.user.id,
            birthDetails: { 
                dob: person1.dob, 
                time: person1.time || '12:00', 
                place: person1.place || 'Unknown' 
            },
            zodiac: zodiac1,
            ascendant: getAscendant(person1.dob, person1.time || '12:00'),
            lifePath: getLifePathNumber(person1.dob),
            dosha: checkMangalDosha(person1.dob, person1.time || '12:00'),
            question: `Compatibility Match with ${person2.name || 'Partner 2'} (${zodiac2})`,
            aiResult // In this case, keep string or convert to object depending on what frontend expects. String works fine as previously.
        });

        await newInsight.save();
        res.json({ match: aiResult, insight: newInsight, zodiac1, zodiac2 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/astrology/tarot
// @desc    Perform an interactive Tarot reading (Offline DB variations)
// @access  Private
router.post('/tarot', auth, async (req, res) => {
    const { cards, contextText, dob, time, place } = req.body;
    if (!cards || cards.length !== 3) {
        return res.status(400).json({ msg: 'Please provide exactly 3 drawn Tarot cards' });
    }

    try {
        const aiResult = await generateTarot(cards);

        const newInsight = new Insight({
            userId: req.user.id,
            birthDetails: { 
                dob: dob || new Date(), 
                time: time || '12:00', 
                place: place || 'Unknown' 
            },
            zodiac: dob ? getZodiacSign(dob) : "Tarot",
            ascendant: dob ? getAscendant(dob, time || '12:00') : "Unknown",
            lifePath: dob ? getLifePathNumber(dob) : 0,
            dosha: dob ? checkMangalDosha(dob, time || '12:00') : "None",
            question: `3-Card Tarot Reading (${contextText || 'General'})`,
            aiResult
        });

        await newInsight.save();
        res.json({ reading: aiResult, insight: newInsight });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/astrology/history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const insights = await Insight.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(insights);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/astrology/panchang
// @desc    Get daily Panchang (Shubh Muhurat & Rahu Kaal)
// @access  Public
router.get('/panchang', (req, res) => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const today = new Date(now.getTime() + istOffset);
    
    const dayOfWeek = today.getUTCDay(); 
    
    const rahuKaalMap = [
        "16:30 - 18:00", "07:30 - 09:00", "15:00 - 16:30", 
        "12:00 - 13:30", "13:30 - 15:00", "10:30 - 12:00", "09:00 - 10:30"
    ];

    const shubhMuhuratMap = [
        "09:00 - 10:30", "10:30 - 12:00", "12:00 - 13:30", 
        "16:30 - 18:00", "07:30 - 09:00", "15:00 - 16:30", "13:30 - 15:00"
    ];

    const tithis = [
        "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", 
        "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", 
        "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
    ];
    
    const knownNewMoon = new Date(Date.UTC(2024, 11, 30, 22, 27));
    const diffDays = (today.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    
    let currentCycleDays = diffDays % 29.53058867;
    if (currentCycleDays < 0) currentCycleDays += 29.53058867; 
    
    const tithiIndex = Math.floor(currentCycleDays / 0.9843529); 
    
    const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
    const currentTithi = tithis[tithiIndex % 15];
    
    res.json({
        date: today.toISOString().split('T')[0],
        day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek],
        shubhMuhurat: shubhMuhuratMap[dayOfWeek],
        rahuKaal: rahuKaalMap[dayOfWeek],
        tithi: `${paksha} ${currentTithi}`
    });
});

module.exports = router;
