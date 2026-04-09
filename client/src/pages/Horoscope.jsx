import { useState, useContext } from 'react';
import axios from 'axios';
import { Moon } from 'lucide-react';
import CosmicLoader from '../components/CosmicLoader';
import { AuthContext } from '../context/AuthContext';

const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const Horoscope = () => {
    const { language } = useContext(AuthContext);
    const [selectedSign, setSelectedSign] = useState('Aries');
    const [timeframe, setTimeframe] = useState('daily');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const onGenerate = async () => {
        setLoading(true);
        setResult(null);
        try {
            const [res] = await Promise.all([
                axios.get(`http://localhost:5000/api/astrology/horoscope?sign=${selectedSign}&timeframe=${timeframe}&language=${language}`),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            setResult(res.data.aiResult || res.data.reading);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full relative z-10 mt-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Moon className="text-blue-400" size={32} />
                AI Horoscope
            </h1>
            <p className="text-gray-400 mb-8">Select a zodiac sign for AI-generated daily or monthly foresight.</p>

            <div className="glass-panel p-8 rounded-2xl shadow-lg border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden">
                <div className="absolute -top-[100px] -right-[100px] opacity-5">
                    <Moon size={300} />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8 relative z-10">
                    {signs.map(sign => (
                        <button
                            key={sign}
                            onClick={() => setSelectedSign(sign)}
                            className={`p-3 rounded-xl border text-center transition-all duration-300 font-medium ${selectedSign === sign ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}
                        >
                            {sign}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 mb-8 justify-center relative z-10">
                    <button 
                        onClick={() => setTimeframe('daily')}
                        className={`px-8 py-2.5 rounded-full font-medium transition-colors ${timeframe === 'daily' ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        Daily Forecast
                    </button>
                    <button 
                        onClick={() => setTimeframe('monthly')}
                        className={`px-8 py-2.5 rounded-full font-medium transition-colors ${timeframe === 'monthly' ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        Monthly Forecast
                    </button>
                </div>

                <div className="text-center relative z-10">
                    <button 
                        onClick={onGenerate} 
                        disabled={loading}
                        className="glow-btn bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-10 rounded-xl flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/30"
                    >
                        {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                        Read the Stars
                    </button>
                </div>
            </div>

            {loading ? (
                 <div className="flex flex-col items-center justify-center py-10 mt-8 opacity-90 glass-panel rounded-2xl border-white/5">
                    <CosmicLoader theme="horoscope" text="Channeling the cosmos..." />
                 </div>
            ) : result && (
                <div className="glass-panel p-8 rounded-2xl mt-8 animate-fade-in border-blue-500/20 shadow-lg shadow-blue-500/10 relative overflow-hidden">
                    <h3 className="text-2xl font-bold text-white mb-6 z-10 relative flex items-center gap-2">
                        {selectedSign} <span className="text-blue-400/80 font-normal text-lg">({timeframe})</span>
                    </h3>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line relative z-10 text-lg bg-white/5 p-6 rounded-xl border border-white/10">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Horoscope;
