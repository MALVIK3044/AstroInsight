import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Hash } from 'lucide-react';
import CosmicLoader from '../components/CosmicLoader';

const Numerology = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', dob: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                dob: user.birthDetails?.dob ? user.birthDetails.dob.split('T')[0] : ''
            });
        }
    }, [user]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const [res] = await Promise.all([
                axios.post('http://localhost:5000/api/astrology/numerology', formData),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full relative z-10 mt-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Hash className="text-teal-400" size={32} />
                Numerology Calculator
            </h1>
            <p className="text-gray-400 mb-8 max-w-2xl">Calculate your Life Path Number and understand its deep cosmic vibration.</p>

            <div className="flex flex-col gap-10">
                <div className="glass-panel p-8 rounded-2xl h-fit border-teal-500/20 shadow-lg shadow-teal-500/5">
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input 
                                type="text" required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 text-white"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                            <input 
                                type="date" required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 text-white"
                                value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                        <button disabled={loading} type="submit" className="w-full glow-btn bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-4 shadow-lg shadow-teal-500/20">
                            {loading ? 'Calculating...' : 'Calculate Life Path'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center animate-fade-in border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                        <CosmicLoader theme="numerology" text="Calculating numerological paths..." />
                    </div>
                ) : result && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in relative z-10 text-center">
                        <div className="glass-panel p-8 rounded-2xl border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute -top-10 -left-10 opacity-5 text-emerald-500">
                                <Hash size={150} />
                            </div>
                            <p className="text-gray-400 uppercase tracking-widest text-xs mb-1 font-medium relative z-10">Psychic Number</p>
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Mulank</h3>
                            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-500 mb-6 drop-shadow-lg relative z-10">
                                {result.mulank}
                            </h2>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left relative z-10 shadow-inner text-sm h-full flex flex-col">
                                <h4 className="text-emerald-300 font-semibold mb-1">Core Personality</h4>
                                <p className="text-gray-300 leading-relaxed text-xs">Based on your birth day, Mulank {result.mulank} represents your inner psychic self, defining your basic inclinations, likes, dislikes, and how you view yourself.</p>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-2xl border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.15)] relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute -bottom-10 -right-10 opacity-5 text-teal-500">
                                <Hash size={150} />
                            </div>
                            <p className="text-gray-400 uppercase tracking-widest text-xs mb-1 font-medium relative z-10">Destiny Number</p>
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Bhagyank</h3>
                            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-cyan-500 mb-6 drop-shadow-lg relative z-10">
                                {result.lifePath}
                            </h2>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left relative z-10 shadow-inner text-sm h-full flex flex-col">
                                <h4 className="text-teal-300 font-semibold mb-1">Life Purpose</h4>
                                <p className="text-gray-300 leading-relaxed text-xs">Derived from your complete date of birth, Bhagyank {result.lifePath} is your ultimate destiny path. It reveals your career trajectory and karmic timeline.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Numerology;
