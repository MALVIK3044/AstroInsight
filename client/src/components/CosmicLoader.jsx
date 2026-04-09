import { Sparkles, Star, Hash, Flame, Moon, Compass } from 'lucide-react';

const CosmicLoader = ({ text = "Consulting the cosmos...", theme = "default" }) => {
    
    if (theme === 'kundli') {
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full min-h-[250px] bg-transparent">
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 border-[3px] border-purple-500/30 rounded-full animate-[spin_8s_linear_infinite] border-dashed"></div>
                    <div className="absolute inset-4 border border-sky-400/50 rounded-full animate-[spin_4s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent' }}></div>
                    <div className="absolute inset-8 bg-gradient-to-tr from-purple-600 to-sky-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.6)] flex items-center justify-center z-10">
                        <Compass className="text-white w-8 h-8 opacity-90 animate-[spin_10s_linear_infinite]" />
                    </div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-sky-300 animate-pulse font-medium tracking-wide text-lg">{text}</p>
                </div>
            </div>
        );
    }
    
    if (theme === 'numerology') {
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full min-h-[250px] bg-transparent">
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-teal-500/30 rotate-45 animate-pulse"></div>
                    <div className="absolute inset-2 border-2 border-emerald-500/40 rotate-12 animate-[spin_6s_linear_infinite]"></div>
                    <div className="absolute inset-8 bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-[0_0_40px_rgba(20,184,166,0.6)] flex items-center justify-center z-10 rotate-45 transform transition-transform">
                        <Hash className="text-white w-8 h-8 opacity-90 -rotate-45" />
                    </div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 animate-pulse font-medium tracking-wide text-lg">{text}</p>
                </div>
            </div>
        );
    }
    
    if (theme === 'dosha') {
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full min-h-[250px] bg-transparent">
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping blur-xl"></div>
                    <div className="absolute inset-4 border border-rose-500/40 rounded-full animate-[spin_2s_linear_infinite]" style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: 'transparent' }}></div>
                    <div className="absolute inset-8 bg-gradient-to-tr from-red-600 to-rose-500 rounded-full animate-pulse shadow-[0_0_50px_rgba(225,29,72,0.8)] flex items-center justify-center z-10">
                        <Flame className="text-white w-8 h-8 opacity-90 animate-bounce" />
                    </div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-red-300 animate-pulse font-medium tracking-wide text-lg">{text}</p>
                </div>
            </div>
        );
    }
    
    if (theme === 'horoscope') {
        return (
            <div className="flex flex-col items-center justify-center p-8 w-full min-h-[250px] bg-transparent">
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]">
                        <div className="absolute -top-2 left-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                    </div>
                    <div className="absolute inset-6 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center z-10">
                        <Moon className="text-white w-8 h-8 opacity-90" />
                    </div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 animate-pulse font-medium tracking-wide text-lg">{text}</p>
                </div>
            </div>
        );
    }

    // Default / AskAI / Sparkles theme
    return (
        <div className="flex flex-col items-center justify-center p-8 w-full min-h-[250px] bg-transparent">
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border border-pink-500/30 rounded-full animate-[spin_4s_linear_infinite]" style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}></div>
                <div className="absolute inset-2 border border-purple-500/40 rounded-full animate-[spin_3s_linear_infinite_reverse]" style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}></div>
                <div className="absolute inset-6 bg-gradient-to-tr from-pink-600 to-purple-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(236,72,153,0.6)] flex items-center justify-center z-10">
                    <Sparkles className="text-white w-8 h-8 opacity-90" />
                </div>
                <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl rounded-full"></div>
            </div>
            <div className="relative z-10 text-center">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 animate-pulse font-medium tracking-wide text-lg">{text}</p>
            </div>
        </div>
    );
};

export default CosmicLoader;
