import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Stars, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import CosmicLoader from '../components/CosmicLoader';

const NorthIndianChart = ({ planets }) => {
    const getHousePos = (h) => {
        const positions = {
            1: { x: 150, y: 75 }, 2: { x: 75, y: 40 }, 3: { x: 40, y: 80 },
            4: { x: 75, y: 150 }, 5: { x: 40, y: 220 }, 6: { x: 75, y: 260 },
            7: { x: 150, y: 225 }, 8: { x: 225, y: 260 }, 9: { x: 260, y: 220 },
            10: { x: 225, y: 150 }, 11: { x: 260, y: 80 }, 12: { x: 225, y: 40 }
        };
        return positions[h];
    };

    return (
        <div className="flex justify-center my-8 animate-fade-in relative z-10 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] bg-[#0a0c1a] border-2 border-purple-500 shadow-inner rounded-sm">
                <rect x="5" y="5" width="290" height="290" fill="url(#chartBg)" stroke="#d8b4fe" strokeWidth="2" strokeOpacity="0.3" />
                <defs>
                    <radialGradient id="chartBg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#0a0c1a" stopOpacity="1" />
                    </radialGradient>
                </defs>
                <line x1="5" y1="5" x2="295" y2="295" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="5" y1="295" x2="295" y2="5" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="150" y1="5" x2="295" y2="150" stroke="#a855f7" strokeWidth="2" />
                <line x1="295" y1="150" x2="150" y2="295" stroke="#a855f7" strokeWidth="2" />
                <line x1="150" y1="295" x2="5" y2="150" stroke="#a855f7" strokeWidth="2" />
                <line x1="5" y1="150" x2="150" y2="5" stroke="#a855f7" strokeWidth="2" />
                
                {planets && Object.keys(planets).map((house) => {
                    const pos = getHousePos(house);
                    const housePlanets = planets[house].join(', ');
                    return (
                        <g key={house}>
                            <text x={pos.x} y={pos.y - 12} textAnchor="middle" fill="#64748b" fontSize="10">{house}</text>
                            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#f3e8ff" fontWeight="bold" fontSize="13" filter="drop-shadow(0px 0px 4px rgba(216, 180, 254, 0.8))">{housePlanets}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const Kundli = () => {
    const { user, language } = useContext(AuthContext);
    const [formData, setFormData] = useState({ dob: '', time: '', place: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.birthDetails?.dob) {
            setFormData({
                dob: user.birthDetails.dob.split('T')[0],
                time: user.birthDetails.time || '',
                place: user.birthDetails.place || ''
            });
        }
    }, [user]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const [res] = await Promise.all([
                axios.post('http://localhost:5000/api/astrology/kundli', { ...formData, language }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error generating Kundli');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const element = document.getElementById('kundli-export-node');
        html2canvas(element, { backgroundColor: '#0a0c1a', scale: 2 }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `AstroInsight-Kundli-${user?.name?.replace(/\s+/g, '-') || 'Export'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="max-w-4xl mx-auto w-full relative z-10 mt-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Stars className="text-purple-400" size={32} />
                Vedic Kundli Generator
            </h1>
            <p className="text-gray-400 mb-8 max-w-2xl">Calculate your precise planetary alignments and receive an AI-interpreted reading.</p>

            <div className="flex flex-col gap-10">
                <div className="glass-panel p-8 rounded-2xl h-fit shadow-lg shadow-black/50 border-purple-500/10">
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                            <input 
                                type="date" required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 text-white"
                                value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Time of Birth</label>
                            <input 
                                type="time" required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 text-white"
                                value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <input 
                                type="text" required placeholder="City, Country"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 text-white"
                                value={formData.place} onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                            />
                        </div>
                        <button disabled={loading} type="submit" className="w-full glow-btn bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-4 flex items-center justify-center gap-2">
                            {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                            Generate Insight History
                        </button>
                        {error && <div className="text-red-400 mt-2 text-sm text-center">{error}</div>}
                    </form>
                </div>

                <div className="glass-panel p-8 rounded-2xl h-fit border-purple-500/20 shadow-lg shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-90">
                            <CosmicLoader theme="kundli" text="Consulting the cosmos..." />
                        </div>
                    ) : result ? (
                        <div className="space-y-6 animate-fade-in relative">
                            {/* Export Button */}
                            <button onClick={handleExport} className="absolute -top-4 -right-4 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white p-3 rounded-full transition-all border border-purple-500/30 z-20 group" title="Share & Download">
                                <Download size={18} className="group-hover:animate-bounce" />
                            </button>

                            <div id="kundli-export-node" className="p-4 rounded-xl -m-4 bg-[#0a0c1a]">
                                <NorthIndianChart planets={result.planets} />

                                <div className="grid grid-cols-2 gap-4 text-center mt-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors">
                                        <h4 className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Zodiac</h4>
                                        <p className="font-bold text-lg text-purple-300">{result.zodiac}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors">
                                        <h4 className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Ascendant</h4>
                                        <p className="font-bold text-lg text-purple-300">{result.ascendant || 'Unknown'}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors">
                                        <h4 className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Life Path</h4>
                                        <p className="font-bold text-lg text-purple-300">{result.lifePath}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors">
                                        <h4 className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Dosha</h4>
                                        <p className="font-bold text-lg text-rose-300">{result.dosha}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-6 border-t border-white/10 pt-6">
                                    <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">AI Interpretation</h3>
                                        {typeof result.aiResult === 'object' && result.aiResult !== null ? (
                                            <div className="space-y-4">
                                                <p><strong className="text-purple-300">Personality:</strong> {result.aiResult.personality}</p>
                                                <p><strong className="text-purple-300">Career:</strong> {result.aiResult.career}</p>
                                                <p><strong className="text-purple-300">Love:</strong> {result.aiResult.love}</p>
                                                <p><strong className="text-purple-300">Health:</strong> {result.aiResult.health}</p>
                                                {result.aiResult.numerologyTraits && <p><strong className="text-purple-300">Numerology:</strong> {result.aiResult.numerologyTraits}</p>}
                                                {result.aiResult.doshaResult && <p><strong className="text-purple-300">Dosha Secrets:</strong> {result.aiResult.doshaResult} <br/><span className="text-emerald-400">Remedy:</span> {result.aiResult.doshaRemedy}</p>}
                                            </div>
                                        ) : (
                                            result.aiResult
                                        )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50 text-center">
                            <Stars size={48} className="mb-4 text-purple-500 opacity-50" />
                            <p>Fill out the form to generate your personalized Vedic Kundli chart interpretation.</p>
                            {!user?.birthDetails?.dob && (
                                <Link to="/profile" className="mt-4 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 justify-center transition-colors">Set up profile to auto-fill</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kundli;
