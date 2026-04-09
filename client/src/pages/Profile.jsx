import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, fetchUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', dob: '', time: '', place: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                dob: user.birthDetails?.dob ? user.birthDetails.dob.split('T')[0] : '',
                time: user.birthDetails?.time || '',
                place: user.birthDetails?.place || ''
            });
        }
    }, [user]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await axios.put('http://localhost:5000/api/user/profile', formData);
            await fetchUser();
            setMessage({ text: 'Profile updated successfully. Your details will now auto-fill across all tools!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Error updating profile', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full relative z-10 mt-4">
            <h1 className="text-3xl font-bold mb-2">Cosmic Profile</h1>
            <p className="text-gray-400 mb-8">Save your birth data to globally power all personal astrology tools on the platform.</p>

            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden shadow-lg shadow-black/50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                
                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                            <input 
                                type="date" 
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Time of Birth</label>
                            <input 
                                type="time" 
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Place of Birth (City, Country)</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g., Mumbai, India"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            value={formData.place}
                            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="glow-btn bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-xl mt-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                        Save Profile Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
