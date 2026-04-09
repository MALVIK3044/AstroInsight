const { generateAstrologyInsight } = require('./services/aiService');
require('dotenv').config();

// We intentionally use dummy API key so it hits the fallback.
process.env.GEMINI_API_KEY = "your_gemini_api_key_here";

async function runTests() {
    console.log("================= KUNDLI FULL READING =================");
    const kundliPrompt = `Act as an expert Vedic astrologer. I was born on 1998-08-15 at 14:30 in New York. My calculative chart shows Zodiac: Leo, Ascendant: Sagittarius, Life Path Numerology: 5, and No Mangal Dosha. Provide a highly personalized 3-paragraph Kundli reading based on these core facts. Focus on personality, career, and relationships. Use an engaging space/mystical tone.`;
    console.log(await generateAstrologyInsight(kundliPrompt, "Leo", "English"));
    
    console.log("\n================= TAROT READING =================");
    const tarotPrompt = `Act as a master Tarot reader. The user is asking for a Career reading. They have drawn three cards in a Past, Present, Future spread: Past - The Fool, Present - Seven of Wands, Future - The Sun. Provide a beautifully written reading.`;
    console.log(await generateAstrologyInsight(tarotPrompt, "Tarot", "English"));
    
    console.log("\n================= COMPATIBILITY MATCH =================");
    const matchPrompt = `Act as an expert Vedic relationship astrologer. Analyze the romantic and spiritual compatibility between Person 1 (John, born 1995-02-14, Zodiac: Aquarius) and Person 2 (Jane, born 1998-05-20, Zodiac: Taurus). Begin the response with a direct "Compatibility Score: [X]/100".`;
    console.log(await generateAstrologyInsight(matchPrompt, "Aquarius", "English"));
    
    console.log("\n================= DAILY HOROSCOPE =================");
    const horoscopePrompt = `Give me a 2-paragraph daily horoscope reading for Scorpio. Focus on general life advice.`;
    console.log(await generateAstrologyInsight(horoscopePrompt, "Scorpio", "English"));
    
    console.log("\n================= ASK-AI ORACLE =================");
    const oraclePrompt = `You are a personalized AI Astrologer. A user born on 1999-10-12 at 09:15 asks: "Will I get the new job next month?". Their chart details: Zodiac=Libra, Give a direct response.`;
    console.log(await generateAstrologyInsight(oraclePrompt, "Libra", "English"));
}

runTests();
