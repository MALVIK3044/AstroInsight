import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, Trash2, Cpu, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Admin = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalUsers: 0, totalInsights: 0, totalTokens: 0, engagementChart: [] });
    const [usersList, setUsersList] = useState([]);
    const [insightsFeed, setInsightsFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { 'x-auth-token': token } } : {};
    };

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes, feedRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/users', getAuthHeaders()),
                axios.get('http://localhost:5000/api/admin/insights-feed', getAuthHeaders())
            ]);
            setStats(statsRes.data);
            setUsersList(usersRes.data);
            setInsightsFeed(feedRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to completely erase this user and their astrology insight data?")) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, getAuthHeaders());
            fetchAdminData();
        } catch (err) {
            console.error(err);
        }
    };

    const updateUserRole = async (id, newRole) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, getAuthHeaders());
            // Update local state instead of re-fetching everything
            setUsersList(usersList.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error(err);
            alert("Failed to update user role");
        }
    };

    const updateUserTier = async (id, newTier) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/tier`, { tier: newTier }, getAuthHeaders());
            setUsersList(usersList.map(u => u._id === id ? { ...u, subscriptionPlan: newTier } : u));
        } catch (err) {
            console.error(err);
            alert("Failed to update user tier");
        }
    };

    if (loading) return <div className="spinner mt-10 mx-auto"></div>;

    return (
        <div className="max-w-7xl mx-auto w-full relative z-10 mt-4 space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Admin Command Center</span>
                </h1>
                <p className="text-gray-400">Manage users, view application statistics, and maintain the database securely.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border-rose-500/20 flex items-center gap-6">
                    <div className="bg-rose-500/20 p-4 rounded-xl text-rose-400"><Users size={32} /></div>
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium">Registered Users</h3>
                        <p className="text-4xl font-bold text-white mt-1">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-orange-500/20 flex items-center gap-6">
                    <div className="bg-orange-500/20 p-4 rounded-xl text-orange-400"><Activity size={32} /></div>
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium">Insights Generated</h3>
                        <p className="text-4xl font-bold text-white mt-1">{stats.totalInsights}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 flex items-center gap-6">
                    <div className="bg-indigo-500/20 p-4 rounded-xl text-indigo-400"><Cpu size={32} /></div>
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium">AI Token Approximations</h3>
                        <p className="text-4xl font-bold text-white mt-1">{stats.totalTokens.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-lg shadow-black/50">
                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                    <Activity className="text-purple-400" size={24} /> 7-Day Insight Engagement
                </h2>
                <div className="h-[300px] w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.engagementChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#d8b4fe' }}
                            />
                            <Line type="monotone" dataKey="count" name="Insights Created" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 8, fill: '#d8b4fe' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Management */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <Users className="text-sky-400" size={24} /> Platform Users
                </h2>
                <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                                    <th className="py-4 px-6 font-medium">Name / Email</th>
                                    <th className="py-4 px-6 font-medium">Registered Date</th>
                                    <th className="py-4 px-6 font-medium">Role</th>
                                    <th className="py-4 px-6 font-medium">Tier</th>
                                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u) => (
                                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="text-white font-medium">{u.name}</p>
                                            <p className="text-gray-500 text-xs">{u.email}</p>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6">
                                            <select 
                                                value={u.role} 
                                                onChange={(e) => updateUserRole(u._id, e.target.value)}
                                                className={`bg-[#0f1123] border ${u.role === 'admin' ? 'border-rose-500/50 text-rose-400' : 'border-blue-500/50 text-blue-400'} rounded px-2 py-1 text-xs font-medium cursor-pointer focus:outline-none`}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-6">
                                            <select 
                                                value={u.subscriptionPlan || 'Free'} 
                                                onChange={(e) => updateUserTier(u._id, e.target.value)}
                                                className={`bg-[#0f1123] border ${u.subscriptionPlan === 'Premium' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-gray-500/50 text-gray-400'} rounded px-2 py-1 text-xs font-medium cursor-pointer focus:outline-none`}
                                            >
                                                <option value="Free">Free Tier</option>
                                                <option value="Premium">Premium</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {u._id !== user._id && (
                                                <button 
                                                    onClick={() => deleteUser(u._id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Global Insight Feed */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <MessageSquare className="text-emerald-400" size={24} /> Live Insight Data Feed
                </h2>
                <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="sticky top-0 bg-[#0a0c1a] z-10">
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="py-3 px-6 font-medium w-1/4">User</th>
                                    <th className="py-3 px-6 font-medium w-1/4">Query Context</th>
                                    <th className="py-3 px-6 font-medium w-1/2">Generated Result Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insightsFeed.map((insight) => (
                                    <tr key={insight._id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                                        <td className="py-4 px-6">
                                            {insight.userId ? (
                                                <>
                                                    <p className="font-medium text-emerald-200">{insight.userId.name}</p>
                                                    <p className="text-xs text-gray-500">{insight.userId.email}</p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500 italic">Deleted User</p>
                                            )}
                                            <p className="text-[10px] text-gray-600 mt-1">{new Date(insight.createdAt).toLocaleString()}</p>
                                        </td>
                                        <td className="py-4 px-6 text-gray-300">
                                            {insight.question || `Full Kundli Generate`}
                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 border border-white/10">{insight.zodiac}</span>
                                                {insight.ascendant && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 border border-white/10">Asc: {insight.ascendant}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-gray-400 line-clamp-3 leading-relaxed">
                                                {typeof insight.aiResult === 'object' && insight.aiResult !== null ? (
                                                    <span>{insight.aiResult.personality?.substring(0, 80)}... [Structured JSON Output]</span>
                                                ) : (
                                                    insight.aiResult
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
