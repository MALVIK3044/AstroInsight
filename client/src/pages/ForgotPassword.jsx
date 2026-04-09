import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const requestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email: formData.email });
            setSuccess('Recovery OTP sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error locating user account.');
        } finally {
            setLoading(false);
        }
    };

    const submitReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', formData);
            setSuccess('Password reset successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error resetting password.');
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/auth/resend-otp', { email: formData.email });
            setSuccess('A new OTP has been dispatched to your email.');
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">Account Recovery</h2>
                
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-4 text-sm border border-red-500/20">{error}</div>}
                {success && <div className="bg-emerald-500/20 text-emerald-300 p-3 rounded-xl mb-4 text-sm border border-emerald-500/20">{success}</div>}
                
                {step === 1 ? (
                    <form onSubmit={requestReset} className="space-y-4">
                        <p className="text-sm text-gray-400 text-center mb-6">Enter your registered email address to receive a secure password reset link.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Account Email</label>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full glow-btn bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                            Request Reset Link
                        </button>
                    </form>
                ) : (
                    <form onSubmit={submitReset} className="space-y-4">
                        <p className="text-sm text-gray-400 text-center mb-6">Enter the 6-digit access code sent to your email to authorize the new password.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Reset Code from Email</label>
                            <input 
                                type="text" 
                                required maxLength={6}
                                className="w-full text-center tracking-widest text-xl font-bold bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-white"
                                value={formData.otp}
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">New Secure Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-white"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full glow-btn bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="spinner border-2 w-5 h-5 border-white border-left-transparent"></div>}
                            Finalize Password Update
                        </button>

                        <div className="border-t border-white/10 mt-6 pt-4 text-center">
                            <button 
                                type="button" 
                                onClick={resendOtp} disabled={loading}
                                className="text-sm text-amber-500/70 hover:text-amber-400 font-semibold"
                            >
                                Did not receive code? Click to Resend.
                            </button>
                        </div>
                    </form>
                )}
                
                <p className="mt-8 text-center text-sm text-gray-400">
                    Remembered it? <Link to="/login" className="text-red-400 hover:text-red-300">Return to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
