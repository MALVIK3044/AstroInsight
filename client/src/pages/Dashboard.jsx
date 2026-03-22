import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, Moon, Sun, Star, Compass } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [zodiacSign, setZodiacSign] = useState('Aries');
  const [domain, setDomain] = useState('Career');
  const [loading, setLoading] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const domains = ['Career', 'Health', 'Relationships', 'Personal Growth'];

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (!user) {
      navigate('/login');
    } else {
      setUserInfo(JSON.parse(user));
      fetchHistory();
    }
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/insight/history');
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setCurrentInsight(null);
    try {
      const { data } = await api.post('/insight/generate', { zodiacSign, domain });
      setCurrentInsight(data);
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <>
      <div className="ambient-light"></div>
      <div className="container fade-in" style={{ padding: '2rem 1rem 4rem 1rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to your space,</h2>
            <h2 className="text-gradient" style={{ fontSize: '3.5rem', lineHeight: '1' }}>{userInfo.name}</h2>
          </div>
          {userInfo.isAdmin && (
            <button className="btn-primary" onClick={() => navigate('/admin')} style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              Admin Portal
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          
          {/* Left Column - Controls */}
          <div className="glass-panel slide-up stagger-1" style={{ alignSelf: 'start', padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '12px' }}>
                <Sparkles size={24} className="text-gradient-purple" />
              </div>
              Seek Alignment
            </h3>
            
            <div className="form-group">
              <label className="form-label">Active Sign</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="form-input" 
                  value={zodiacSign} 
                  onChange={(e) => setZodiacSign(e.target.value)}
                  style={{ cursor: 'pointer', appearance: 'none' }}
                >
                  {zodiacSigns.map(sign => <option key={sign} value={sign} style={{background: '#0f172a'}}>{sign}</option>)}
                </select>
                <Star size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label className="form-label">Life Domain</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="form-input" 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)}
                  style={{ cursor: 'pointer', appearance: 'none' }}
                >
                  {domains.map(d => <option key={d} value={d} style={{background: '#0f172a'}}>{d}</option>)}
                </select>
                <Compass size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Consulting the Stars...' : <><Moon size={22} fill="currentColor" /> Generate Insight</>}
            </button>
            
            {error && <div style={{ color: '#ff7eb3', marginTop: '1.5rem', textAlign: 'center', background: 'rgba(236,72,153,0.1)', padding: '1rem', borderRadius: '10px' }}>{error}</div>}
          </div>

          {/* Right Column - Results & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Current Insight */}
            {currentInsight && (
              <div className="glass-panel slide-up" style={{ border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.7), rgba(15, 23, 42, 0.4))' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem' }}>
                  <Sun size={24} className="text-gradient" /> Celestial Guidance
                </h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500', background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>{currentInsight.zodiacSign}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500', background: 'rgba(236, 72, 153, 0.2)', color: '#fbcfe8', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>{currentInsight.domain}</span>
                </div>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.9', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{currentInsight.aiResponse}</p>
              </div>
            )}

            {/* History */}
            <div className="glass-panel slide-up stagger-2" style={{ flexGrow: 1 }}>
              <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem' }}>
                <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '8px', borderRadius: '12px' }}>
                  <Star size={24} color="#fbbf24" />
                </div>
                Cosmic Log
              </h3>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Moon size={40} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your cosmic journey awaits. Generate an insight to begin.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                  {history.map(item => (
                    <div key={item._id} style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', borderLeft: '4px solid var(--accent-primary)', transition: 'transform 0.2s', cursor: 'pointer' }} className="history-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'white' }}>{item.domain} Check-in</strong>
                        <small style={{ color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '8px' }}>
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </small>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                        {item.aiResponse}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .history-card:hover {
          transform: translateX(5px);
          background: rgba(30, 41, 59, 0.6) !important;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
