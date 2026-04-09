import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password.length <= 4) {
            setError('Password must be more than 4 characters.');
            setLoading(false);
            return;
        }
        if (!/[@#$]/.test(formData.password)) {
            setError('Password must contain a special character (@, #, $).');
            setLoading(false);
            return;
        }

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard'); // Direct navigation on successful registration and token fetch
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-sky-500"></div>
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
                    Join AstroInsight
                </h2>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-4 text-sm border border-red-500/20">{error}</div>}
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full glow-btn bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
                    >
                        {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                        Begin Journey
                    </button>
                </form>
                
                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
