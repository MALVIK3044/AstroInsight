import { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Sparkles, Stars, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/astrology/history');
                setInsights(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getIcon = (question) => {
        if (question === 'Full Kundli Reading') return <Stars className="text-purple-400" size={28} />;
        if (question?.includes('Horoscope')) return <Moon className="text-blue-400" size={28} />;
        return <Sparkles className="text-pink-400" size={28} />;
    };

    if (loading) return <div className="spinner mt-20 mx-auto w-12 h-12 border-emerald-500"></div>;

    return (
        <div className="max-w-5xl mx-auto w-full relative z-10 mt-4 pb-12">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <HistoryIcon className="text-emerald-400" size={32} />
                Cosmic Insight History
            </h1>
            <p className="text-gray-400 mb-10">Revisit all of your past generated Kundli charts and AI questions stored securely.</p>

            {insights.length === 0 ? (
                <div className="glass-panel p-16 rounded-3xl text-center border-dashed border-2 border-white/10 shadow-lg">
                    <HistoryIcon size={80} className="mx-auto mb-6 text-emerald-500 opacity-30" />
                    <h3 className="text-2xl font-bold text-white mb-2">No History Yet</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't generated any astrology insights or asked the AI any questions yet.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/kundli" className="px-6 py-3 bg-purple-600/20 text-purple-300 font-medium rounded-xl hover:bg-purple-600 hover:text-white transition-colors border border-purple-500/30 glow-btn">
                            Generate Kundli
                        </Link>
                        <Link to="/ask-ai" className="px-6 py-3 bg-pink-600/20 text-pink-300 font-medium rounded-xl hover:bg-pink-600 hover:text-white transition-colors border border-pink-500/30 glow-btn">
                            Ask AI Astrologer
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {insights.map((insight) => (
                        <div key={insight._id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors"></div>
                            
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="bg-white/5 p-5 rounded-2xl shrink-0 group-hover:bg-white/10 transition-colors shadow-inner flex items-center justify-center">
                                    {getIcon(insight.question)}
                                </div>
                                
                                <div className="flex-1 w-full min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                        <h3 className="text-xl font-bold text-white truncate pr-4 text-wrap">
                                            {insight.question === 'Full Kundli Reading' ? 'Kundli Chart Reading' : `"${insight.question}"`}
                                        </h3>
                                        <span className="text-sm font-medium text-emerald-400/80 bg-emerald-500/10 px-4 py-1.5 rounded-full whitespace-nowrap border border-emerald-500/20 shrink-0 shadow-inner inline-flex w-fit">
                                            {new Date(insight.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 text-xs mb-5">
                                        <span className="bg-black/30 border border-white/5 text-gray-300 px-3 py-1.5 rounded-lg flex gap-1"><span className="text-gray-500">Zodiac:</span> <strong className="text-white">{insight.zodiac}</strong></span>
                                        <span className="bg-black/30 border border-white/5 text-gray-300 px-3 py-1.5 rounded-lg flex gap-1"><span className="text-gray-500">Asc:</span> <strong className="text-white">{insight.dosha.split(' ')[0] === 'No' ? 'Non-Manglik' : 'Manglik'}</strong></span>
                                        <span className="bg-black/30 border border-white/5 text-gray-300 px-3 py-1.5 rounded-lg flex gap-1"><span className="text-gray-500">Path:</span> <strong className="text-white">{insight.lifePath}</strong></span>
                                    </div>
                                    
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-line shadow-inner max-h-60 overflow-y-auto custom-scrollbar">
                                        {typeof insight.aiResult === 'object' && insight.aiResult !== null ? (
                                            <div className="space-y-3">
                                                <p><strong className="text-emerald-300">Personality:</strong> {insight.aiResult.personality}</p>
                                                <p><strong className="text-emerald-300">Career:</strong> {insight.aiResult.career}</p>
                                                <p><strong className="text-emerald-300">Love:</strong> {insight.aiResult.love}</p>
                                                <p><strong className="text-emerald-300">Health:</strong> {insight.aiResult.health}</p>
                                            </div>
                                        ) : (
                                            insight.aiResult
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
