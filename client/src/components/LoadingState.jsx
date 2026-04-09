import React from 'react';
import { Sparkles, Stars, Atom, Orbit } from 'lucide-react';

const LoadingState = ({ text = "Consulting the cosmos...", theme = "pink" }) => {
    const colorMap = {
        pink: 'text-pink-400 border-pink-500/30',
        purple: 'text-purple-400 border-purple-500/30',
        blue: 'text-blue-400 border-blue-500/30',
        teal: 'text-teal-400 border-teal-500/30',
        rose: 'text-rose-400 border-rose-500/30'
    };
    
    const bgMap = {
        pink: 'bg-pink-500/20',
        purple: 'bg-purple-500/20',
        blue: 'bg-blue-500/20',
        teal: 'bg-teal-500/20',
        rose: 'bg-rose-500/20'
    };
    
    const activeColor = colorMap[theme] || colorMap.pink;
    const activeBg = bgMap[theme] || bgMap.pink;

    return (
        <div className="flex flex-col items-center justify-center py-16 w-full animate-fade-in relative z-10 transition-all duration-500">
            <div className={`relative flex items-center justify-center w-32 h-32 mb-8 rounded-full border ${activeColor} bg-black/40 shadow-[0_0_50px_currentColor] backdrop-blur-sm overflow-hidden`}>
                
                {/* Orbital rings */}
                <div className="absolute inset-0 border-[3px] border-t-transparent border-current rounded-full animate-[spin_3s_linear_infinite] opacity-70"></div>
                <div className="absolute inset-3 border-2 border-r-transparent border-current rounded-full animate-[spin_4s_linear_infinite_reverse] opacity-50"></div>
                <div className="absolute inset-6 border border-b-transparent border-current rounded-full animate-[spin_2s_linear_infinite] opacity-60"></div>
                
                {/* Center glowing element */}
                <div className="relative flex items-center justify-center animate-pulse">
                    <Orbit size={48} className="animate-[spin_8s_linear_infinite]" />
                    <Sparkles size={20} className="absolute -top-3 -right-3 animate-bounce" />
                    <Stars size={16} className="absolute -bottom-2 -left-2 animate-pulse delay-150" />
                </div>
                
                {/* Inner background glow */}
                <div className={`absolute inset-0 ${activeBg} blur-xl rounded-full opacity-50`}></div>
            </div>
            
            <h3 className={`text-xl font-bold tracking-widest uppercase mb-3 ${activeColor.split(' ')[0]}`}>
                Analyzing
            </h3>
            <p className="text-gray-300 animate-pulse font-medium tracking-wide max-w-xs text-center text-sm">
                {text}
            </p>
            
            {/* Progress bar effect */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden relative shadow-inner">
                <div className={`absolute top-0 left-[-100%] h-full w-full bg-current ${activeColor.split(' ')[0]} rounded-full animate-[translateX_2s_ease-in-out_infinite]`}></div>
                <style jsx>{`
                    @keyframes translateX {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(200%); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default LoadingState;
