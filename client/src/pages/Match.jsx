import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import CosmicLoader from '../components/CosmicLoader';

const Match = () => {
    const { user, language } = useContext(AuthContext);
    const [person1, setPerson1] = useState({ name: '', dob: '', time: '', place: '' });
    const [person2, setPerson2] = useState({ name: '', dob: '', time: '', place: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.birthDetails?.dob) {
            setPerson1({
                name: user.name || 'Partner 1',
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
                axios.post('http://localhost:5000/api/astrology/match', { person1, person2, language }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error calculating compatibility');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const element = document.getElementById('match-export-node');
        html2canvas(element, { backgroundColor: '#0a0c1a', scale: 2 }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `AstroInsight-Match-${person1.name || 'P1'}-${person2.name || 'P2'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="max-w-5xl mx-auto w-full relative z-10 mt-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Heart className="text-rose-400" size={32} />
                Partner Compatibility
            </h1>
            <p className="text-gray-400 mb-8 max-w-2xl">Discover deep cosmic connections and astrological compatibility between two individuals.</p>

            <div className="flex flex-col gap-10">
                <form onSubmit={onSubmit} className="glass-panel p-8 rounded-2xl h-fit border-rose-500/10 shadow-lg shadow-black/50">
                    <div className="grid md:grid-cols-2 gap-8 relative">
                        {/* Person 1 */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-rose-300 mb-4 border-b border-rose-500/20 pb-2">Your Details (Partner 1)</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" required placeholder="Name"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:border-rose-500 text-white"
                                    value={person1.name} onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                                <input 
                                    type="date" required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:border-rose-500 text-white"
                                    value={person1.dob} onChange={(e) => setPerson1({ ...person1, dob: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Divider Line on Desktop */}
                        <div className="hidden md:block absolute left-1/2 top-4 bottom-0 w-px bg-gradient-to-b from-rose-500/0 via-rose-500/30 to-rose-500/0 -translate-x-1/2"></div>
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 items-center justify-center border border-rose-500/30">
                            <Heart size={14} className="animate-pulse" />
                        </div>

                        {/* Person 2 */}
                        <div className="space-y-4 mt-8 md:mt-0">
                            <h3 className="text-xl font-semibold text-rose-300 mb-4 border-b border-rose-500/20 pb-2">Partner Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" required placeholder="Partner's Name"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:border-rose-500 text-white"
                                    value={person2.name} onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                                <input 
                                    type="date" required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:border-rose-500 text-white"
                                    value={person2.dob} onChange={(e) => setPerson2({ ...person2, dob: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full sm:w-1/2 mx-auto glow-btn bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-8 flex items-center justify-center gap-2">
                        {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                        Calculate Compatibility
                    </button>
                    {error && <div className="text-red-400 mt-4 text-center text-sm">{error}</div>}
                </form>

                <div className="glass-panel p-8 rounded-2xl h-fit border-rose-500/20 shadow-lg shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-90">
                            <CosmicLoader theme="kundli" text="Aligning the stars for love..." />
                        </div>
                    ) : result ? (
                        <div className="space-y-6 animate-fade-in text-center relative">
                            {/* Export Button */}
                            <button onClick={handleExport} className="absolute -top-4 -right-4 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white p-3 rounded-full transition-all border border-rose-500/30 z-20 group" title="Share & Download">
                                <Download size={18} className="group-hover:animate-bounce" />
                            </button>

                            <div id="match-export-node" className="p-8 rounded-xl -m-4 bg-[#0a0c1a]">
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-400 mb-6 border-b border-rose-500/20 pb-4">
                                    {person1.name || 'Partner 1'} & {person2.name || 'Partner 2'}
                                </h2>

                                <div className="flex items-center justify-center gap-6 mb-8 text-lg font-bold">
                                    <span className="text-purple-300 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">{result.zodiac1}</span>
                                    <Heart className="text-rose-500 animate-pulse" size={24} />
                                    <span className="text-sky-300 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20">{result.zodiac2}</span>
                                </div>

                                <div className="text-left bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
                                    <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Cosmic Analysis</h3>
                                    <div className="text-gray-300 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                                        {result.match}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 opacity-50 text-center">
                            <Heart size={48} className="mb-4 text-rose-500 opacity-50" />
                            <p>Enter details for both partners to unveil the cosmic connection between you.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Match;
