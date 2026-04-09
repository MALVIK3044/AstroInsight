import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, User, Stars, Moon, Hash, Flame, Sparkles, History as HistoryIcon, LogOut, ShieldAlert, Compass, ArrowLeft, Heart, Layers, Globe } from 'lucide-react';

const Sidebar = () => {
    const { user, logout, language, changeLanguage } = useContext(AuthContext);
    const location = useLocation();
    const isAdminSide = location.pathname.startsWith('/admin');

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'User Profile', path: '/profile', icon: <User size={18} /> },
        { name: 'Kundli Engine', path: '/kundli', icon: <Stars size={18} /> },
        { name: 'Horoscope', path: '/horoscope', icon: <Moon size={18} /> },
        { name: 'Numerology', path: '/numerology', icon: <Hash size={18} /> },
        { name: 'Dosha Scan', path: '/dosha', icon: <Flame size={18} /> },
        { name: 'Compatibility', path: '/match', icon: <Heart size={18} /> },
        { name: 'Tarot Reading', path: '/tarot', icon: <Layers size={18} /> },
        { name: 'AI Oracle', path: '/ask-ai', icon: <Sparkles size={18} /> },
        { name: 'Insights History', path: '/history', icon: <HistoryIcon size={18} /> },
    ];

    return (
        <div className="w-64 fixed left-0 h-full bg-[#1e293b] flex flex-col z-10 border-r border-slate-700/50 shadow-xl">
            <NavLink 
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-3 px-6 h-20 border-b border-slate-700/50 shrink-0 hover:bg-slate-800/30 transition-colors"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
                    <Compass size={20} className="animate-[spin_15s_linear_infinite]" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide">AstroInsight</h1>
            </NavLink>
            {!isAdminSide && (
                <div className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">Main Navigation</div>
            )}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {!isAdminSide && navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}

                {user?.role === 'admin' && isAdminSide && (
                    <>
                        <div className="mt-4 mb-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">System Administration</div>
                        <NavLink
                            to="/dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 mb-2"
                        >
                            <ArrowLeft size={18} />
                            <span>Back to Main Site</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                <div className="flex items-center gap-3 px-2 py-2 mb-3">
                    <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold uppercase shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-white truncate">{user?.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400 capitalize truncate">{user?.role}</span>
                            {user?.subscriptionPlan === 'Premium' ? (
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.3)] border border-amber-500/50">PREMIUM</span>
                            ) : (
                                <span className="text-[9px] bg-slate-600/50 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-500/50">FREE</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full mt-2 flex items-center justify-between px-3 py-2 rounded-lg border border-slate-600/50 bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-sky-400" />
                        <span className="text-sm font-medium text-slate-300">AI Language</span>
                    </div>
                    <select 
                        value={language} 
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-xs font-bold px-0.5 py-1 rounded text-white cursor-pointer focus:outline-none focus:border-indigo-500 max-w-[80px]"
                    >
                        <option value="English">EN</option>
                        <option value="Hindi">HI</option>
                        <option value="Gujarati">GUJ</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
