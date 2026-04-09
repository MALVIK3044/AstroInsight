import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import CosmicLoader from '../components/CosmicLoader';

const AskAI = () => {
    const { user, language } = useContext(AuthContext);
    const [formData, setFormData] = useState({ question: '', dob: '', time: '', place: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.birthDetails?.dob) {
            setFormData(prev => ({
                ...prev,
                dob: user.birthDetails.dob.split('T')[0],
                time: user.birthDetails.time || '',
                place: user.birthDetails.place || ''
            }));
        }
    }, [user]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // We do not clear the actual result so we can see the chat scroll but for simplicity we show one Q/A pair per view now
        try {
            const [res] = await Promise.all([
                axios.post('http://localhost:5000/api/astrology/ask-ai', { ...formData, language }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);
            setResult(res.data);
            setFormData(prev => ({ ...prev, question: '' }));
        } catch (err) {
            setError(err.response?.data?.msg || 'Error consulting AI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full relative z-10 mt-4 h-[82vh] flex flex-col">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 shrink-0">
                <Sparkles className="text-pink-400" size={32} />
                Ask AI Astrologer
            </h1>
            <p className="text-gray-400 mb-6 shrink-0">Ask any specific question and receive an answer specifically contextualized with your astrological markers.</p>

            <div className="flex-1 glass-panel p-6 sm:p-8 rounded-2xl border-pink-500/20 shadow-lg shadow-pink-500/5 flex flex-col relative overflow-hidden">
                {!user?.birthDetails?.dob && (
                    <div className="bg-amber-500/10 text-amber-400 p-4 rounded-xl text-sm mb-6 border border-amber-500/20">
                        Please <Link to="/profile" className="underline font-bold hover:text-amber-300">complete your profile</Link> to fuel the AI with your chart context for accurate readings.
                    </div>
                )}
                {user?.subscriptionPlan !== 'Premium' && (
                    <div className="bg-sky-500/10 text-sky-400 p-3 rounded-xl text-sm mb-4 border border-sky-500/20 flex justify-between items-center shrink-0">
                        <span>You are on the <b>Free Tier</b> (Limit: 3 AI Questions total).</span>
                    </div>
                )}
                
                <div className="flex-1 overflow-y-auto pr-4 space-y-6 flex flex-col pt-2">
                    {result ? (
                        <>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl rounded-br-sm self-end max-w-[85%] animate-fade-in shadow-md shadow-black/20">
                                <p className="text-gray-200 text-lg">"{result.question}"</p>
                            </div>
                            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 p-6 sm:p-8 rounded-3xl rounded-bl-sm self-start max-w-[95%] animate-fade-in relative shadow-lg shadow-pink-500/5">
                                <Sparkles size={20} className="absolute top-5 right-5 text-pink-400 opacity-50" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-4 flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#ec4899]"></div> AI Oracle
                                </h4>
                                <p className="text-white leading-relaxed text-lg whitespace-pre-line">{result.aiResult}</p>
                                
                                <div className="mt-6 pt-5 border-t border-pink-500/20 flex flex-wrap gap-3 text-xs">
                                    <span className="bg-pink-500/20 border border-pink-500/30 text-pink-300 px-4 py-1.5 rounded-full font-medium shadow-inner shadow-pink-500/10">Zodiac: {result.zodiac}</span>
                                    <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full font-medium shadow-inner shadow-purple-500/10">Asc: {result.ascendant}</span>
                                    <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full font-medium shadow-inner shadow-blue-500/10">Life Path: {result.lifePath}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="m-auto flex flex-col items-center justify-center opacity-60 text-center space-y-6 p-6">
                            <div className="relative mb-4">
                                <Sparkles size={80} className="text-pink-500" />
                                <div className="absolute inset-0 bg-pink-500 blur-3xl -z-10 opacity-30"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3">The Oracle is Ready</h3>
                                <div className="space-y-2 max-w-sm text-gray-400 italic">
                                    <p>"Will my career improve this year?"</p>
                                    <p>"Is this a good time to relocate?"</p>
                                    <p>"What energy surrounds my relationships?"</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {loading && (
                        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 p-2 sm:p-4 rounded-3xl rounded-bl-sm self-start animate-fade-in flex items-center gap-4 shadow-lg shadow-pink-500/5 w-full sm:w-[85%] md:w-[70%]">
                            <CosmicLoader theme="askai" text="Analyzing planetary configurations..." />
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 shrink-0 relative bg-transparent">
                    {error && <div className="absolute -top-10 left-0 w-full text-red-400 text-sm mb-3 text-center bg-red-500/10 py-2 rounded-lg">{error}</div>}
                    <form onSubmit={onSubmit} className="flex gap-3 relative z-10">
                        <input 
                            type="text" required
                            placeholder="Ask the cosmos a question..."
                            className="flex-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all text-white text-lg shadow-inner placeholder:text-gray-500"
                            value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            disabled={loading || !user?.birthDetails?.dob}
                        />
                        <button disabled={loading || !user?.birthDetails?.dob} type="submit" className="glow-btn bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-medium px-8 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 transition-all">
                            <Send size={24} className="-ml-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AskAI;
