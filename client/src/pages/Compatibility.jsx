import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { HeartHandshake, Sparkles, Moon, Star, RefreshCw } from 'lucide-react';

const Compatibility = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [person2Name, setPerson2Name] = useState('');
  const [person2BirthDate, setPerson2BirthDate] = useState('');
  const [person2BirthTime, setPerson2BirthTime] = useState('');
  const [person2Location, setPerson2Location] = useState('');
  const [relationshipType, setRelationshipType] = useState('Romantic');

  const relationTypes = ['Romantic', 'Friendship', 'Business', 'Family'];

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
      const { data } = await api.get('/compatibility');
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCurrentReport(null);

    try {
      const payload = {
        person2Name,
        person2BirthDate,
        person2BirthTime,
        person2Location,
        relationshipType
      };
      const { data } = await api.post('/compatibility', payload);
      setCurrentReport(data);
      fetchHistory();
      
      // Clear form
      setPerson2Name('');
      setPerson2BirthDate('');
      setPerson2BirthTime('');
      setPerson2Location('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <>
      <div className="ambient-light-2"></div>
      <div className="container fade-in" style={{ padding: '2rem 1rem 4rem 1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '16px', borderRadius: '20px' }}>
            <HeartHandshake color="#fbcfe8" size={36} />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Synastry Engine</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Discover cosmic alignment between two souls.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
          
          <div className="glass-panel slide-up stagger-1" style={{ alignSelf: 'start', padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
               <Sparkles size={22} className="text-gradient-purple" /> Link Stars
            </h3>
            
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label className="form-label">Their Name</label>
                <input type="text" className="form-input" value={person2Name} onChange={e => setPerson2Name(e.target.value)} required placeholder="e.g. Alex" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input type="date" className="form-input" value={person2BirthDate} onChange={e => setPerson2BirthDate(e.target.value)} required style={{colorScheme: 'dark'}} />
                </div>
                <div className="form-group">
                  <label className="form-label">Birth Time</label>
                  <input type="time" className="form-input" value={person2BirthTime} onChange={e => setPerson2BirthTime(e.target.value)} style={{colorScheme: 'dark'}} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Birth City</label>
                <input type="text" className="form-input" value={person2Location} onChange={e => setPerson2Location(e.target.value)} placeholder="e.g. London, UK" />
              </div>

              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label className="form-label">Connection Type</label>
                <select className="form-input" value={relationshipType} onChange={e => setRelationshipType(e.target.value)}>
                   {relationTypes.map(t => <option key={t} value={t} style={{background: '#0f172a'}}>{t}</option>)}
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }} disabled={loading}>
                {loading ? <RefreshCw className="floating" size={22} /> : <><Moon size={22} /> Unveil Connection</>}
              </button>
            </form>

            {error && <div style={{ color: '#ff7eb3', marginTop: '1.5rem', textAlign: 'center', background: 'rgba(236,72,153,0.1)', padding: '1rem', borderRadius: '10px' }}>{error}</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Active Report */}
            {currentReport && (
              <div className="glass-panel slide-up" style={{ border: '1px solid rgba(236, 72, 153, 0.4)', background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.8), rgba(15, 23, 42, 0.5))' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem' }}>
                  <Star size={24} className="text-gradient" /> Cosmic Resonance Map
                </h3>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                     <span style={{ fontSize: '0.9rem', color: '#fbcfe8', background: 'rgba(236, 72, 153, 0.2)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>{userInfo.name.split(' ')[0]} & {currentReport.person2Name}</span>
                     <span style={{ fontSize: '0.9rem', color: '#c4b5fd', background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>{currentReport.relationshipType}</span>
                  </div>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.9', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{currentReport.aiReport}</p>
              </div>
            )}

            {/* History Links */}
            <div className="glass-panel slide-up stagger-2" style={{ flexGrow: 1 }}>
              <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                Synastry Archives
              </h3>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                  No charts mapped yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }} className="custom-scrollbar">
                  {history.map(item => (
                    <div key={item._id} style={{ padding: '1.2rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', borderLeft: '3px solid #ec4899', cursor: 'pointer' }} onClick={() => setCurrentReport(item)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: 'white' }}>{item.person2Name}</strong>
                        <small style={{ color: 'var(--text-secondary)' }}>{new Date(item.createdAt).toLocaleDateString()}</small>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#c4b5fd', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>{item.relationshipType}</span>
                      <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.aiReport}</p>
                    </div>
                  ))}
                </div>
              )}
             </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Compatibility;
