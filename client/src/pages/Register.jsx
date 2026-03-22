import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Birth Data Collection (Crucial for Astrology)
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { 
        name, 
        email, 
        password,
        birthDate,
        birthTime,
        birthLocation
      }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ambient-light-2"></div>
      <div className="slide-up container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem 2.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <UserPlus size={30} color="#ec4899" />
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Discover Yourself</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>To generate your exact natal chart, we need your birth details.</p>
          </div>

          {error && <div style={{ color: '#ff7eb3', marginBottom: '1.5rem', textAlign: 'center', background: 'rgba(236, 72, 153, 0.1)', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>{error}</div>}
          
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your celestial designation" />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="universe@example.com" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="birthDate">Birth Date</label>
                <input type="date" id="birthDate" className="form-input" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required style={{colorScheme: 'dark'}} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="birthTime">Exact Time</label>
                <input type="time" id="birthTime" className="form-input" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} required style={{colorScheme: 'dark'}} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="birthLocation">City of Birth</label>
              <input type="text" id="birthLocation" className="form-input" value={birthLocation} onChange={(e) => setBirthLocation(e.target.value)} required placeholder="e.g. New York, NY" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm</label>
                <input type="password" id="confirmPassword" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
              </div>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }} disabled={loading}>
              {loading ? 'Aligning Planets...' : 'Create Account'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Already mapped your stars? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
