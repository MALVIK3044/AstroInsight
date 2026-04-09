import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Flame } from 'lucide-react';
import CosmicLoader from '../components/CosmicLoader';

const Dosha = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ dob: '', time: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.birthDetails?.dob) {
            setFormData({
                dob: user.birthDetails.dob.split('T')[0],
                time: user.birthDetails.time || ''
            });
        }
    }, [user]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const [res] = await Promise.all([
                axios.post('http://localhost:5000/api/astrology/dosha', formData),
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
                <Flame className="text-rose-400" size={32} />
                Mangal Dosha Detector
            </h1>
            <p className="text-gray-400 mb-8 max-w-2xl">Analyze your planetary alignments to detect Vedic Doshas like Mangal Dosha.</p>

            <div className="flex flex-col gap-10">
                <div className="glass-panel p-8 rounded-2xl h-fit border-rose-500/20 shadow-lg shadow-rose-500/5">
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                            <input 
                                type="date" required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500 text-white"
                                value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Time of Birth</label>
                            <input 
                                type="time" required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500 text-white"
                                value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <button disabled={loading} type="submit" className="w-full glow-btn bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-4 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2">
                            {loading ? <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div> : null}
                            {loading ? 'Scanning Universe...' : 'Detect Dosha'}
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center animate-fade-in border-rose-500/20 shadow-[0_0_30px_rgba(225,29,72,0.1)]">
                        <CosmicLoader theme="dosha" text="Scanning Universe for planetary alignments..." />
                    </div>
                ) : result && (
                     <div className={`glass-panel p-8 rounded-2xl flex flex-col justify-center animate-fade-in relative overflow-hidden ${result.dosha.includes('No') ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-rose-500/50 shadow-[0_0_30px_rgba(225,29,72,0.2)]'}`}>
                        <div className="text-center relative z-10">
                            {result.dosha.includes('No') ? (
                                <div className="text-emerald-400 mb-6 inline-block bg-emerald-500/10 p-5 rounded-full shadow-lg shadow-emerald-500/20">
                                    <Flame size={56} />
                                </div>
                            ) : (
                                <div className="text-rose-500 mb-6 inline-block bg-rose-500/10 p-5 rounded-full animate-pulse shadow-lg shadow-rose-500/20">
                                    <Flame size={56} />
                                </div>
                            )}
                            <h2 className="text-3xl font-bold text-white mb-4">{result.dosha}</h2>
                            <p className="text-gray-300 mt-4 leading-relaxed bg-black/20 p-5 rounded-xl border border-white/5 text-sm">
                                This calculation evaluates your time of birth, establishing your ascendant to be <strong className="text-white">{result.ascendant}</strong>. 
                                {result.dosha.includes('No') ? ' Your cosmic energy is well-balanced regarding Mars.' : ' Minor to moderate Mars energy is detected. Astrological remediation or simple awareness is advised.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dosha;
