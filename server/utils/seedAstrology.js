const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ZodiacInsight = require('../models/ZodiacInsight');
const NumerologyInsight = require('../models/NumerologyInsight');
const DoshaRule = require('../models/DoshaRule');
const HoroscopeData = require('../models/HoroscopeData');
const CompatibilityData = require('../models/CompatibilityData');
const TarotData = require('../models/TarotData');

dotenv.config();

const zodiacSigns = [
    {
        name: 'Aries',
        traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Optimistic', 'Honest', 'Passionate'],
        career: ['You are a natural leader. Career leaps are expected.', 'Entrepreneurship looks highly favorable for you.', 'Your pioneering spirit will open new career doors.', 'Focus on your ambition, you are set for a promotion.', 'Take the initiative at work, it will be deeply rewarded.'],
        love: ['Passionate romance is on the horizon.', 'Your honest communication brings you closer to your partner.', 'An exciting new encounter awaits you.', 'Your fiery nature keeps your love life vibrant.', 'Patience in love will resolve recent misunderstandings.'],
        health: ['High energy levels. Great time for a new workout.', 'Watch out for minor headaches. Stay hydrated.', 'Your physical vitality is peaking.', 'Focus on balancing work and rest to maintain stamina.', 'Incorporate meditation to calm your fiery mind.']
    },
    {
        name: 'Taurus',
        traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible', 'Stable'],
        career: ['Financial stability is yours if you stay the course.', 'A conservative investment will pay off soon.', 'Your dedication at work is being noticed by superiors.', 'Stick to your practical approach to solve office problems.', 'A slow and steady rise in your career is evident.'],
        love: ['A grounded and secure relationship is blooming.', 'Sensual experiences bring great joy right now.', 'Loyalty from your partner brings you peace of mind.', 'Building a home together is highly favorable now.', 'Take time to appreciate the small gestures in love.'],
        health: ['Focus on your throat and neck health.', 'A consistent routine is your best medicine.', 'Indulge in healthy, grounding foods.', 'Nature walks will immensely boost your mental health.', 'Ensure you get enough sleep to maintain your steady energy.']
    },
    {
        name: 'Gemini',
        traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Ability to learn quickly'],
        career: ['Your communication skills will close a big deal.', 'Networking is heavily favored for your career growth.', 'Your adaptability makes you an asset in changing environments.', 'A quick learning opportunity will advance your position.', 'Brainstorming sessions will be highly productive for you.'],
        love: ['Intellectual conversations spark deep romance.', 'A flirtatious encounter could turn into something more.', 'Keep communication open to avoid misunderstandings.', 'Variety is the spice of your love life right now.', 'Your curious nature leads you to a fascinating partner.'],
        health: ['Mental stimulation is key to your wellbeing.', 'Protect your respiratory system, get some fresh air.', 'Try a new, engaging form of exercise.', 'Nervous energy needs an outlet—try journaling.', 'Your dual nature requires balancing rest and activity.']
    },
    {
        name: 'Cancer',
        traits: ['Tenacious', 'Highly imaginative', 'Loyal', 'Emotional', 'Sympathetic', 'Persuasive'],
        career: ['Your intuitive approach solves a complex work issue.', 'Nurturing your team brings immense professional respect.', 'A work-from-home opportunity may present itself.', 'Trust your gut feelings on new business ventures.', 'Your loyalty to your company will be rewarded soon.'],
        love: ['Emotional depth in your relationship strengthens your bond.', 'A cozy night in is exactly what your love life needs.', 'Family connections play a positive role in your romance.', 'Your nurturing soul attracts a very protective partner.', 'Vulnerability will open doors to profound intimacy.'],
        health: ['Pay attention to your digestive health.', 'Emotional wellbeing directly impacts your physical state.', 'Water-based exercises (like swimming) are highly beneficial.', 'Create a comforting home environment to recharge.', 'Listen to your body\'s need for rest and retreat.']
    },
    {
        name: 'Leo',
        traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful', 'Humorous'],
        career: ['Your natural leadership propels you to the spotlight.', 'A creative project will garner widespread acclaim.', 'Charisma is your greatest tool in upcoming negotiations.', 'Generosity with colleagues builds a fiercely loyal team.', 'Step onto the stage; management roles are calling you.'],
        love: ['A grand, theatrical romance is unfolding.', 'Your warmth and generosity make you irresistible.', 'Passion runs high in your current relationship.', 'Playfulness will reignite the spark with your partner.', 'You deeply crave and will receive admiration from your lover.'],
        health: ['Your heart and spine need special attention and care.', 'Engage in activities that make you feel joyful and alive.', 'Sunshine is essential for your vitality.', 'Don\'t let pride stop you from seeking medical advice if needed.', 'Cardiovascular workouts are highly recommended.']
    },
    {
        name: 'Virgo',
        traits: ['Loyal', 'Analytical', 'Kind', 'Hardworking', 'Practical'],
        career: ['Your meticulous attention to detail saves a project.', 'Analytical skills lead to a significant professional breakthrough.', 'Hard work behind the scenes is finally recognized.', 'A practical approach to organization increases your efficiency.', 'Service-oriented tasks bring you great satisfaction and success.'],
        love: ['Acts of service are your love language right now.', 'A practical, grounded approach to relationships works best.', 'Your loyalty forms a bedrock of trust with your partner.', 'Don\'t overanalyze your partner\'s harmless remarks.', 'Kindness and attention to the little things win hearts.'],
        health: ['Gut health is paramount; watch your diet closely.', 'Your nervous system needs calming activities like yoga.', 'A well-structured daily routine keeps you healthy.', 'Don\'t let worry and overthinking affect your digestion.', 'Herbal remedies and clean eating are highly favored.']
    },
    {
        name: 'Libra',
        traits: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded', 'Social'],
        career: ['Your diplomatic skills resolve a major workplace conflict.', 'Partnerships and collaborations are highly lucrative now.', 'A fair-minded approach earns you respect from peers.', 'Aesthetics and design tasks will be very successful.', 'Networking in social settings brings new career paths.'],
        love: ['Harmony and balance redefine your relationship.', 'A highly romantic and cooperative period awaits.', 'Compromise is key to your current romantic success.', 'You might find love in an artistic or social setting.', 'Graciousness makes you a magnet for potential partners.'],
        health: ['Kidney health is important; drink plenty of water.', 'Balance in all things—diet, work, and play—is crucial.', 'Avoid extremes and seek a harmonious lifestyle.', 'Gentle, partner-based exercises (like ballroom dance or acro-yoga) are great.', 'Mental peace directly translates to physical wellness.']
    },
    {
        name: 'Scorpio',
        traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'A true friend'],
        career: ['Your intense focus uncovers hidden professional opportunities.', 'A transformative period in your career is beginning.', 'Resourcefulness gets you out of a tight spot at work.', 'Your investigative skills are highly valued right now.', 'A powerful, strategic move puts you ahead of the competition.'],
        love: ['Profound, transformative passion defines your love life.', 'Your intense loyalty creates deep, unbreakable bonds.', 'Secrets may be revealed, leading to greater intimacy.', 'A magnetic attraction draws someone special to you.', 'Emotional depth and honesty are required for relationship success.'],
        health: ['Reproductive health should be a focus.', 'Release pent-up emotional energy through intense workouts.', 'Your regenerative powers are extremely strong.', 'Detoxification (physical or emotional) is highly beneficial.', 'Avoid holding onto grudges, as it affects your vitality.']
    },
    {
        name: 'Sagittarius',
        traits: ['Generous', 'Idealistic', 'Great sense of humor'],
        career: ['A long-distance or international opportunity arises.', 'Your boundless optimism inspires your entire team.', 'Publishing, teaching, or philosophical pursuits are favored.', 'A bold, expansive vision leads to career growth.', 'Your humor diffuses a tense workplace situation.'],
        love: ['A sense of adventure invigorates your romance.', 'Honesty and freedom are crucial in your relationship.', 'You might connect deeply with someone from a different background.', 'A spontaneous trip brings you closer to your partner.', 'Shared ideals and philosophical discussions foster deep love.'],
        health: ['Your liver and thighs are areas to watch.', 'Outdoor activities and sports are essential for you.', 'Don\'t overindulge; moderation is key to your health.', 'Your energetic nature requires a robust fitness routine.', 'Optimism is your best defense against illness.']
    },
    {
        name: 'Capricorn',
        traits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers'],
        career: ['Your disciplined ambition leads directly to the top.', 'A major long-term goal is finally achieved.', 'Your excellent management skills are publicly recognized.', 'Pragmatism and hard work secure your financial future.', 'A position of high authority is within your grasp.'],
        love: ['Traditional values strengthen your romantic bonds.', 'A reliable and ambitious partner catches your eye.', 'You build love slowly, ensuring a solid foundation.', 'Your commitment and loyalty are unquestioned.', 'Practical support is how you express deep affection.'],
        health: ['Bone, joint, and teeth health are paramount.', 'Maintain a disciplined approach to your exercise routine.', 'Your stamina is incredible, but beware of overworking.', 'Protect your knees during physical activities.', 'Structured relaxation is necessary to combat stress.']
    },
    {
        name: 'Aquarius',
        traits: ['Progressive', 'Original', 'Independent', 'Humanitarian'],
        career: ['A brilliant, original idea disrupts your industry in a good way.', 'Teamwork and group projects are highly successful.', 'Your progressive vision sets you apart from the crowd.', 'Technological or scientific pursuits are heavily favored.', 'Your independence leads to a unique career path.'],
        love: ['Intellectual stimulation is the foundation of your romance.', 'A friendship slowly blossoms into a deep love affair.', 'Your unconventional approach to relationships brings joy.', 'Give your partner space, and they will pull closer.', 'Shared humanitarian goals unite you with your lover.'],
        health: ['Circulation and ankles need your attention.', 'Alternative therapies might offer surprising benefits.', 'Mental tension needs releasing through erratic, fun movement.', 'Stay hydrated to support your nervous electricity.', 'Group fitness classes appeal to your communal spirit.']
    },
    {
        name: 'Pisces',
        traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise', 'Musical'],
        career: ['Your mystical creativity leads to a beautiful project.', 'Compassion in the workplace earns you deep devotion.', 'Trust your profound intuition in business decisions.', 'Artistic endeavors bring both spiritual and material rewards.', 'A behind-the-scenes role allows your talents to shine.'],
        love: ['Your empathy creates an almost psychic bond with your partner.', 'A highly romantic, fairy-tale connection is possible now.', 'Set healthy boundaries to protect your gentle heart.', 'A soulful, spiritual love completely envelopes you.', 'Music and poetry enhance your romantic experiences.'],
        health: ['Your feet are sensitive; take good care of them.', 'Your immune system requires gentle, holistic care.', 'Sleep and dream-work are crucial for your mental health.', 'Water therapies and swimming are incredibly healing.', 'Protect yourself from absorbing others negative energies.']
    }
];

const lifePaths = [
    { number: 1, traits: ['Independent', 'Leader', 'Pioneering'], strengths: ['Innovation', 'Self-reliance'], weaknesses: ['Stubbornness', 'Ego'] },
    { number: 2, traits: ['Peacemaker', 'Diplomatic', 'Cooperative'], strengths: ['Empathy', 'Partnership'], weaknesses: ['Over-sensitivity', 'Indecision'] },
    { number: 3, traits: ['Creative', 'Social', 'Expressive'], strengths: ['Communication', 'Optimism'], weaknesses: ['Scattered energy', 'Superficiality'] },
    { number: 4, traits: ['Practical', 'Hardworking', 'Grounded'], strengths: ['Organization', 'Discipline'], weaknesses: ['Rigidity', 'Pessimism'] },
    { number: 5, traits: ['Adventurous', 'Free-spirited', 'Versatile'], strengths: ['Adaptability', 'Courage'], weaknesses: ['Restlessness', 'Inconsistency'] },
    { number: 6, traits: ['Nurturing', 'Responsible', 'Caring'], strengths: ['Compassion', 'Healing'], weaknesses: ['Overbearing', 'Self-righteous'] },
    { number: 7, traits: ['Spiritual', 'Analytical', 'Seeker'], strengths: ['Intellect', 'Intuition'], weaknesses: ['Isolation', 'Cynicism'] },
    { number: 8, traits: ['Ambitious', 'Powerful', 'Material-focused'], strengths: ['Leadership', 'Financial Acumen'], weaknesses: ['Workaholic', 'Materialistic'] },
    { number: 9, traits: ['Humanitarian', 'Compassionate', 'Global'], strengths: ['Selflessness', 'Wisdom'], weaknesses: ['Naivety', 'Overly emotional'] },
    { number: 11, traits: ['Intuitive', 'Illuminator', 'Visionary'], strengths: ['Inspiration', 'Spiritual insight'], weaknesses: ['Nervous tension', 'Impracticality'] },
    { number: 22, traits: ['Master Builder', 'Practical Idealist'], strengths: ['Manifestation', 'Large-scale vision'], weaknesses: ['Overwhelm', 'Controlling behavior'] },
    { number: 33, traits: ['Master Teacher', 'Healing', 'Divine'], strengths: ['Universal love', 'Guidance'], weaknesses: ['Self-sacrifice', 'Burdened'] }
];

const doshaRules = [
    { condition: "No Mangal Dosha", result: "Your chart indicates a balanced Martian energy. No Mangal Dosha is present.", remedy: ["No specific remedies required.", "Continue to worship and maintain positive energy."] },
    { condition: "Mangal Dosha Present (Low/Partial)", result: "There is a partial Mangal Dosha in your chart. It may cause minor frictions in partnerships but is easily manageable.", remedy: ["Chant Hanuman Chalisa daily.", "Offer sweets to a temple on Tuesdays."] },
    { condition: "High Mangal Dosha Present", result: "A prominent Mangal Dosha is observed. This indicates intense, dynamic energy that requires focus and grounding, particularly in marriage.", remedy: ["Perform Kumbh Vivah before marriage.", "Fast on Tuesdays.", "Wear Red Coral after consulting an astrologer."] }
];

// Combine all logic into async seed
async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/astroinsight");
        console.log("Connected to DB, clearing collections...");

        await ZodiacInsight.deleteMany({});
        await NumerologyInsight.deleteMany({});
        await DoshaRule.deleteMany({});
        await HoroscopeData.deleteMany({});
        await CompatibilityData.deleteMany({});
        await TarotData.deleteMany({});

        console.log("Seeding Zodiac Insights...");
        for (let sign of zodiacSigns) {
            await ZodiacInsight.create({
                zodiac: sign.name,
                personality: sign.traits,
                career: sign.career,
                love: sign.love,
                health: sign.health
            });
            // Also seed basic Horoscope variations based on the same signs
            await HoroscopeData.create({
                zodiac: sign.name,
                daily: [
                    `Today is a day to focus on your natural ${sign.traits[0]} tendencies. Embrace new opportunities!`,
                    `The stars highlight your ${sign.traits[1] ? sign.traits[1] : sign.traits[0]} nature today. Stay positive.`,
                    `Expect a pleasant surprise today if you trust your intuition and remain open.`
                ],
                monthly: [
                    `This month, your career and love life will intertwine. Use your ${sign.traits[0]} spirit to lead.`,
                    `A transformative month awaits. Focus on personal growth and health.`,
                    `Relationships are highlighted this month. Be communicative and open-hearted.`
                ]
            });
        }

        console.log("Seeding Numerology...");
        for (let num of lifePaths) {
            await NumerologyInsight.create(num);
        }

        console.log("Seeding Dosha Rules...");
        for (let rule of doshaRules) {
            await DoshaRule.create(rule);
        }

        console.log("Seeding Compatibility (Basic Rules)...");
        // We will add a few specific combinations and a generic default logic in service
        await CompatibilityData.create({
            zodiac1: "Aries", zodiac2: "Leo", compatibilityScore: 95,
            description: ["A fiery, passionate match full of mutual admiration.", "You both love the spotlight and deeply understand each other's drive."]
        });
        await CompatibilityData.create({
            zodiac1: "Taurus", zodiac2: "Virgo", compatibilityScore: 92,
            description: ["A grounded, practical, and incredibly stable relationship.", "You build a beautiful life based on mutual respect and loyalty."]
        });

        console.log("Seeding Tarot Cards...");
        const tarotCards = [
            { cardName: "The Fool", meaning: ["New beginnings", "Spontaneity", "Leap of faith"], advice: ["Take a chance on that new opportunity.", "Embrace the unknown with a positive spirit."] },
            { cardName: "The Magician", meaning: ["Willpower", "Creation", "Manifestation"], advice: ["You have all the tools you need to succeed.", "Focus your intent to bring your desires into reality."] },
            { cardName: "The High Priestess", meaning: ["Intuition", "Unconscious", "Inner voice"], advice: ["Trust your gut feelings over pure logic right now.", "A period of reflection will bring profound clarity."] },
            { cardName: "The Lovers", meaning: ["Love", "Harmony", "Choices"], advice: ["A significant choice regarding relationships is approaching.", "Seek alignment between your values and your actions."] },
            { cardName: "The Chariot", meaning: ["Direction", "Control", "Willpower"], advice: ["Stay focused and determined to overcome obstacles.", "Victory is yours if you maintain discipline."] }
        ];
        for (let card of tarotCards) {
            await TarotData.create(card);
        }

        console.log("Database Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("Error seeding DB:", err);
        process.exit(1);
    }
}

seedDB();
