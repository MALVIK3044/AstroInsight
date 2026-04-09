import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Stars, Sparkles, Compass, Hash, History as HistoryIcon, Sun, Moon as MoonIcon, DivideSquare } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [panchang, setPanchang] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/astrology/panchang')
            .then(res => setPanchang(res.data))
            .catch(err => console.error(err));
    }, []);

    const checkProfile = user?.birthDetails && user.birthDetails.dob;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in w-full pb-10 mt-2">
            <div className="glass-panel p-8 md:p-10 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_32px_rgba(168,85,247,0.1)]">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Compass size={180} className="animate-[spin_40s_linear_infinite]" />
                </div>
                
                <div className="relative z-10 flex-1 w-full">
                    <h1 className="text-4xl font-bold mb-3 text-white">Namaste, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{user?.name}</span> 🙏</h1>
                    <p className="text-slate-300 text-lg mb-6 max-w-xl">
                        Your personal AI Astrology portal. Generate Vedic Kundli charts, read your daily horoscope, and ask the Cosmos any question.
                    </p>
                    
                    {!checkProfile ? (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm">
                            <div>
                                <h3 className="text-amber-400 font-semibold mb-1 flex items-center gap-2">Action Required: Profile Incomplete</h3>
                                <p className="text-amber-200/70 text-sm">Enter your birth coordinates to unlock reading generation.</p>
                            </div>
                            <Link to="/profile" className="mt-4 sm:mt-0 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap shadow-md text-sm">
                                Configure Profile
                            </Link>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Profile Active
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/3 relative z-10 shrink-0">
                    <img 
                        src="/vedic-hero.png" 
                        alt="Vedic Astrology Kundli" 
                        className="w-full h-48 md:h-56 object-cover rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] border border-purple-500/30 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all duration-500"
                    />
                </div>
            </div>

            {/* Panchang Cosmic Alert Widget */}
            {panchang && (
                <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                    <div className="bg-[#0a0c1a]/95 rounded-xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="flex-1">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-amber-400 mb-1">
                                <Sun size={24} className="animate-[spin_20s_linear_infinite]" /> 
                                Daily Panchang (Cosmic Metrics)
                            </h3>
                            <p className="text-sm text-gray-400 mb-6 font-medium tracking-wide">
                                {panchang.day}, {panchang.date} | Current Tithi: <span className="text-rose-300 font-semibold">{panchang.tithi}</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <div className="flex-1 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-500/80 font-bold uppercase tracking-widest mb-0.5">Shubh Muhurat (Auspicious)</p>
                                        <p className="text-emerald-300 font-serif text-lg">{panchang.shubhMuhurat}</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                                        <MoonIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-rose-500/80 font-bold uppercase tracking-widest mb-0.5">Rahu Kaal (Avoid Starts)</p>
                                        <p className="text-rose-300 font-serif text-lg">{panchang.rahuKaal}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-panel p-8 bg-[#0a0c1a]/40 border-purple-500/20 shadow-sm transition-shadow">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-purple-500/20 pb-4">
                    <Stars className="text-amber-400" size={26} />
                    Platform Capabilities Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FeatureDescription 
                        icon={<Stars size={20} className="text-purple-400" />}
                        title="Vedic Kundli Engine"
                        desc="Automatically computes your Ascendant, Moon Sign, Planetary placements, and Mangal Dosha based on precise latitudinal and longitudinal birth data."
                    />
                    <FeatureDescription 
                        icon={<Sparkles size={20} className="text-amber-400" />}
                        title="AI Oracle System"
                        desc="Injects your deterministic birth inputs directly into our Google Gemini neural model to generate customized, context-aware foresight readings."
                    />
                    <FeatureDescription 
                        icon={<Hash size={20} className="text-pink-400" />}
                        title="Pythagorean Numerology"
                        desc="Extracts core vibratory numbers—Life Path and Destiny—from your inputs to augment traditional astrological charts with modern numerology."
                    />
                    <FeatureDescription 
                        icon={<HistoryIcon size={20} className="text-emerald-400" />}
                        title="Persistent Insight Logistics"
                        desc="Securely archives every generated Kundli and AI interaction directly in your account's cloud database for seamless longitudinal tracking."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureDescription = ({ icon, title, desc }) => (
    <div className="flex items-start gap-4 p-2 transition-transform hover:-translate-y-0.5">
        <div className="w-12 h-12 rounded-xl bg-[#0a0c1a]/80 border border-purple-500/30 shadow-inner shadow-purple-500/10 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Dashboard;
