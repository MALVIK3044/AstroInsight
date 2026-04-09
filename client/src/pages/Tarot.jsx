import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Layers, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import CosmicLoader from '../components/CosmicLoader';

const MAJOR_ARCANA = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

const TarotCard = ({ card, position, isFlipped, onClick, index }) => (
    <div 
        className={`relative w-40 h-64 md:w-56 md:h-80 cursor-pointer transition-all duration-700 preserve-3d group ${isFlipped ? 'rotate-y-180' : 'hover:-translate-y-2 hover:shadow-2xl'} ${onClick && !isFlipped ? 'animate-float' : ''}`}
        style={{ perspective: '1000px', animationDelay: `${index * 0.2}s` }}
        onClick={onClick}
    >
        <div className={`absolute w-full h-full duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Card Back */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl border border-indigo-400/50 shadow-xl shadow-indigo-500/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-2 border border-indigo-400/30 rounded-lg"></div>
                <Layers className="text-indigo-400/50 w-16 h-16" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50"></div>
            </div>
            
            {/* Card Front */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-xl border border-amber-500/40 shadow-xl shadow-amber-500/20 flex flex-col items-center justify-between p-4 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                <div className="w-full border-t flex-1 border-b border-amber-500/20 my-2 flex items-center justify-center relative overflow-hidden bg-slate-950/50 rounded-lg">
                    <span className="text-3xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">✨</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent"></div>
                </div>
                <div className="text-center font-serif">
                    <p className="text-amber-200 font-bold tracking-wider text-sm md:text-md drop-shadow-md mb-1">{card || "Unknown"}</p>
                    <p className="text-purple-300/70 text-[10px] uppercase font-sans tracking-widest">{position}</p>
                </div>
            </div>
        </div>
    </div>
);

const Tarot = () => {
    const { user, language } = useContext(AuthContext);
    const [contextText, setContextText] = useState('General');
    const [drawnCards, setDrawnCards] = useState([]);
    const [flipStates, setFlipStates] = useState([false, false, false]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const drawRandomCards = () => {
        const shuffled = [...MAJOR_ARCANA].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    };

    const handleDraw = async () => {
        if (drawnCards.length > 0) return; // Already drew

        const newCards = drawRandomCards();
        setDrawnCards(newCards);
        
        // Staggered flip animation
        setTimeout(() => setFlipStates([true, false, false]), 300);
        setTimeout(() => setFlipStates([true, true, false]), 900);
        setTimeout(() => setFlipStates([true, true, true]), 1500);

        // Fetch AI Reading
        setTimeout(() => fetchReading(newCards), 2500);
    };

    const fetchReading = async (cards) => {
        setLoading(true);
        setError('');
        try {
            const [res] = await Promise.all([
                axios.post('http://localhost:5000/api/astrology/tarot', {
                    cards,
                    contextText,
                    language,
                    dob: user?.birthDetails?.dob,
                    time: user?.birthDetails?.time,
                    place: user?.birthDetails?.place
                }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            setResult(res.data.reading);
        } catch (err) {
            setError('The ethereal connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetReading = () => {
        setDrawnCards([]);
        setFlipStates([false, false, false]);
        setResult(null);
        setError('');
    };

    const handleExport = () => {
        const element = document.getElementById('tarot-export-node');
        html2canvas(element, { backgroundColor: '#0a0c1a', scale: 2 }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `AstroInsight-Tarot-${user?.name?.replace(/\s+/g, '-') || 'Reading'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    const positions = ["Past", "Present", "Future"];

    return (
        <div className="max-w-6xl mx-auto w-full relative z-10 mt-4">
            <style>{`
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
            `}</style>
            
            <div className="flex justify-between items-end mb-8 border-b border-indigo-500/20 pb-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-amber-300">
                        <Layers className="text-amber-400" size={32} />
                        Mystic Tarot Reading
                    </h1>
                    <p className="text-gray-400 mt-2">Draw three cards to unveil insights about your past, present, and future.</p>
                </div>
                {result && (
                    <button onClick={resetReading} className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all text-sm font-medium">
                        New Reading
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-10">
                {!result && !loading && drawnCards.length === 0 && (
                    <div className="glass-panel p-6 rounded-2xl mx-auto max-w-sm w-full shadow-lg shadow-indigo-500/10 border-indigo-500/20 text-center animate-fade-in">
                        <label className="block text-sm font-medium text-indigo-200 mb-3 uppercase tracking-wider">Select Reading Context</label>
                        <select 
                            className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer appearance-none mb-6 text-center text-lg"
                            value={contextText}
                            onChange={(e) => setContextText(e.target.value)}
                        >
                            <option value="General">General Guidance</option>
                            <option value="Love">Love & Relationships</option>
                            <option value="Career">Career & Wealth</option>
                            <option value="Spiritual">Spiritual Growth</option>
                        </select>
                        <button 
                            onClick={handleDraw} 
                            className="w-full glow-btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-xl transition-all uppercase tracking-widest text-sm"
                        >
                            Draw 3 Cards
                        </button>
                    </div>
                )}

                {(drawnCards.length > 0) && (
                    <div className="flex flex-col items-center">
                        <div className="flex gap-4 md:gap-12 justify-center perspective-[1200px] py-8">
                            {[0, 1, 2].map(i => (
                                <TarotCard 
                                    key={i} 
                                    index={i}
                                    card={drawnCards[i]} 
                                    position={positions[i]} 
                                    isFlipped={flipStates[i]}
                                />
                            ))}
                        </div>

                        {loading && (
                            <div className="mt-8 animate-fade-in">
                                <CosmicLoader theme="kundli" text="Consulting the spectral oracle..." />
                            </div>
                        )}

                        {error && <div className="text-red-400 mt-6">{error}</div>}

                        {result && (
                            <div className="w-full glass-panel md:p-12 p-8 rounded-2xl mt-8 border-amber-500/20 shadow-lg shadow-[0_0_40px_rgba(245,158,11,0.1)] animate-fade-in relative">
                                {/* Export Button */}
                                <button onClick={handleExport} className="absolute -top-4 -right-4 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white p-3 rounded-full transition-all border border-indigo-500/30 z-20 group" title="Share & Download">
                                    <Download size={18} className="group-hover:animate-bounce" />
                                </button>
                                
                                <div id="tarot-export-node" className="bg-[#0a0c1a] p-8 -m-8 rounded-2xl">
                                    <h3 className="text-2xl font-serif mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 text-center border-b border-amber-500/10 pb-4">
                                        The Oracle Speaks ({contextText})
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-4 justify-center mb-8">
                                        {drawnCards.map((card, i) => (
                                            <div key={i} className="text-center">
                                                <div className="text-xs text-indigo-400 mb-1 uppercase tracking-widest">{positions[i]}</div>
                                                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-amber-200 font-serif text-sm">{card}</div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="text-indigo-100 text-base md:text-lg leading-relaxed md:leading-loose space-y-6 font-serif max-w-4xl mx-auto whitespace-pre-line px-2">
                                        {result}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tarot;
