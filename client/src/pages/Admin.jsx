import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutList, Trash2, Activity } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Mock data for presentation
      // Actual integration will hit the robust backend
      setTimeout(() => {
        setUsers([
          { _id: '1', name: 'Admin User', email: 'admin@astroinsight.com', isAdmin: true, createdAt: new Date().toISOString() },
          { _id: '2', name: 'Nova Star', email: 'nova@universe.com', isAdmin: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', name: 'Orion Belt', email: 'orion@cosmos.net', isAdmin: false, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        ]);
        setInsights([
          { _id: '1', user: { name: 'Nova Star' }, zodiacSign: 'Leo', domain: 'Career', createdAt: new Date().toISOString() },
          { _id: '2', user: { name: 'Orion Belt' }, zodiacSign: 'Cancer', domain: 'Love', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        ]);
        setError(null);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      setError('Failed to fetch admin data.');
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Erase this user from the cosmos?')) {
      setUsers(users.filter(u => u._id !== id));
    }
  };

  const deleteInsight = async (id) => {
    if (window.confirm('Delete this cosmic log?')) {
      setInsights(insights.filter(i => i._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Activity className="text-gradient" size={48} style={{ animation: 'spin 2s linear infinite' }} />
      </div>
    );
  }

  return (
    <>
      <div className="ambient-light"></div>
      <div className="container fade-in" style={{ padding: '2rem 1rem 4rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', gap: '1rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '12px', borderRadius: '16px' }}>
            <Activity color="#ec4899" size={36} />
          </div>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }}>Administrator Console</h2>
        </div>

        {error && (
          <div className="slide-up" style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#fbcfe8', padding: '1.2rem', borderRadius: '12px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="slide-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.1))', padding: '1.2rem', borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
               <Users size={28} color="#c4b5fd" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Souls</p>
              <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{users.length}</h3>
            </div>
          </div>
          
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0.1))', padding: '1.2rem', borderRadius: '50%', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
               <LayoutList size={28} color="#fbcfe8" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Insights Cast</p>
              <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{insights.length}</h3>
            </div>
          </div>
        </div>

        <div className="slide-up stagger-2" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn-primary ${activeTab === 'users' ? '' : 'glass-panel'}`}
            style={{ 
               display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem', border: 'none',
               ...(activeTab !== 'users' ? { background: 'rgba(15, 23, 42, 0.6)', boxShadow: 'none', color: 'var(--text-secondary)' } : {})
            }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} /> Registered Users
          </button>
          <button 
            className={`btn-primary ${activeTab === 'insights' ? '' : 'glass-panel'}`}
             style={{ 
               display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem', border: 'none',
               ...(activeTab !== 'insights' ? { background: 'rgba(15, 23, 42, 0.6)', boxShadow: 'none', color: 'var(--text-secondary)' } : {})
            }}
            onClick={() => setActiveTab('insights')}
          >
            <LayoutList size={20} /> All System Insights
          </button>
        </div>

        <div className="glass-panel slide-up stagger-3" style={{ overflowX: 'auto', padding: '0' }}>
          {activeTab === 'users' && (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Observer</th>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Frequency (Email)</th>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Clearance</th>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>First Sighting</th>
                  <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1.5rem 2rem', fontWeight: '600', color: 'white' }}>{u.name}</td>
                    <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <span style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        background: u.isAdmin ? 'rgba(236, 72, 153, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                        color: u.isAdmin ? '#fbcfe8' : '#c4b5fd',
                        border: u.isAdmin ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)'
                      }}>
                         {u.isAdmin ? 'Council Member' : 'Initiate'}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => deleteUser(u._id)}
                        className="action-btn"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: u.isAdmin ? 'not-allowed' : 'pointer', color: '#fca5a5', padding: '0.6rem', borderRadius: '8px', transition: 'all 0.2s' }}
                        title="Delete User"
                        disabled={u.isAdmin}
                      >
                        <Trash2 size={18} style={{ opacity: u.isAdmin ? 0.3 : 1 }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                   <tr>
                      <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>The cosmos is empty. No users found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'insights' && (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Subject</th>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Constellation</th>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Domain</th>
                  <th style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>Date</th>
                  <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {insights.map(i => (
                  <tr key={i._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1.5rem 2rem', fontWeight: '600', color: 'white' }}>{i.user?.name || 'Unknown'}</td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                       <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.9rem' }}>{i.zodiacSign}</span>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)' }}>{i.domain}</td>
                    <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)' }}>{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                       <button 
                        onClick={() => deleteInsight(i._id)}
                        className="action-btn"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', color: '#fca5a5', padding: '0.6rem', borderRadius: '8px', transition: 'all 0.2s' }}
                        title="Delete Insight"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                 {insights.length === 0 && (
                   <tr>
                      <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No logs floating in the ether.</td>
                   </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .table-row-hover:hover {
          background: rgba(15, 23, 42, 0.4);
        }
        .action-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          transform: scale(1.05);
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Admin;
