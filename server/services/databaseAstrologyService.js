const ZodiacInsight = require('../models/ZodiacInsight');
const NumerologyInsight = require('../models/NumerologyInsight');
const DoshaRule = require('../models/DoshaRule');
const HoroscopeData = require('../models/HoroscopeData');
const CompatibilityData = require('../models/CompatibilityData');
const TarotData = require('../models/TarotData');

// Utility to grab one random element from an array
function getRandom(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate the fully structured JSON for Kundli
async function generateKundli(zodiac, lifePath, doshaCondition) {
    let result = {
        zodiac,
        lifePath,
        dosha: doshaCondition,
        personality: "A unique individual with a blend of universal energies.",
        career: "Your career path holds interesting developments ahead.",
        love: "Your romantical journey is full of lessons and beautiful moments.",
        health: "Maintain proper balance for a healthy life.",
        numerologyTraits: "",
        doshaRemedy: ""
    };

    // Grab Zodiac Data
    const zData = await ZodiacInsight.findOne({ zodiac });
    if (zData) {
        result.personality = zData.personality.join(", ");
        result.career = getRandom(zData.career);
        result.love = getRandom(zData.love);
        result.health = getRandom(zData.health);
    }

    // Grab Numerology Data
    const numData = await NumerologyInsight.findOne({ lifePathNumber: lifePath });
    if (numData) {
        result.numerologyTraits = `Traits: ${numData.traits.join(", ")}. Strengths: ${numData.strengths.join(", ")}. Weaknesses: ${numData.weaknesses.join(", ")}.`;
    }

    // Grab Dosha Data
    const doshaData = await DoshaRule.findOne({ condition: doshaCondition });
    if (doshaData) {
        result.doshaResult = doshaData.result;
        result.doshaRemedy = getRandom(doshaData.remedy);
    }

    return result;
}

// Horoscope fetching
async function generateHoroscope(zodiac, timeframe) {
    const data = await HoroscopeData.findOne({ zodiac });
    if (!data) return `The stars suggest a period of reflection for ${zodiac}.`;

    if (timeframe === "monthly") {
        return getRandom(data.monthly);
    } else {
        return getRandom(data.daily);
    }
}

// Compatibility Match
async function generateCompatibility(zodiac1, zodiac2) {
    // Check specific match
    let match = await CompatibilityData.findOne({
        $or: [
            { zodiac1, zodiac2 },
            { zodiac1: zodiac2, zodiac2: zodiac1 }
        ]
    });

    if (match) {
        return {
            score: match.compatibilityScore,
            description: getRandom(match.description)
        };
    }

    // Generic fallback logic if no exact pair is in DB
    const isSameElement = true; // Simplification
    const baseScore = 70 + Math.floor(Math.random() * 25); // Between 70 and 95
    const descriptions = [
        `The dynamic between ${zodiac1} and ${zodiac2} is a continuous learning curve filled with mutual support.`,
        `There is a profound unspoken understanding between ${zodiac1} and ${zodiac2}.`,
        `While challenges may arise, ${zodiac1} and ${zodiac2} share a karmic bond that strengthens over time.`
    ];

    return {
        score: baseScore,
        description: getRandom(descriptions)
    };
}

// Ask AI offline fallback (Rule-based generic response generator based on signs)
async function generateAskAI(question, zodiac, lifePath) {
    const zData = await ZodiacInsight.findOne({ zodiac });
    const trait = zData ? getRandom(zData.personality) : "unique nature";

    const answers = [
        `The celestial bodies indicate a highly favorable outcome regarding your query. Focus your ${trait} to succeed.`,
        `This cosmic period demands patience. The universe is aligning things perfectly for you behind the scenes.`,
        `Focusing on your Life Path (${lifePath}) strengths will easily resolve this matter. Trust the journey.`,
        `The stars suggest reflecting inward first. Your answer lies deeply entwined with your natural ${trait}.`,
        `Absolutely. The current planetary transits strongly support this specific outcome.`
    ];

    return getRandom(answers);
}

// Tarot Offline Logic
async function generateTarot(cardsArray) {
    let readings = [];
    for (let c of cardsArray) {
        // Simple string matching
        const data = await TarotData.findOne({ cardName: { $regex: new RegExp(c, "i") } });
        if (data) {
            readings.push(`**${c}**: ${getRandom(data.meaning)}. Advice: ${getRandom(data.advice)}`);
        } else {
            readings.push(`**${c}**: Represents mystery and unexpected shifts.`);
        }
    }
    
    return readings.join('\n\n');
}

module.exports = {
    generateKundli,
    generateHoroscope,
    generateCompatibility,
    generateAskAI,
    generateTarot
};
