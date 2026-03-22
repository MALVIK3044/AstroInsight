import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Send, Sparkles, User, MessageCircle } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Verify auth
  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (!user) {
      navigate('/login');
    } else {
      fetchChatHistory();
    }
  }, [navigate]);

  // Keep chat scrolled to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchChatHistory = async () => {
    try {
      const { data } = await api.get('/chat');
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, _id: Date.now().toString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message: userMessage.content });
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optional: Handle error UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ambient-light"></div>
      <div className="container fade-in" style={{ padding: '2rem 1rem 4rem 1rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '12px', borderRadius: '16px' }}>
            <MessageCircle color="#c4b5fd" size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>AI Astrologer</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Your cosmic guide, powered by the stars and AI.</p>
          </div>
        </div>

        <div className="glass-panel slide-up" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
          
          <div className="custom-scrollbar" style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.length === 0 && !loading && (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)' }}>
                <Sparkles size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>Welcome to your sanctuary. Ask me anything about your stars, career, or love life.</p>
              </div>
            )}
            
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg._id || index} className="fade-in" style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '10px' }}>
                  {!isUser && <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '50%', flexShrink: 0 }}><Sparkles size={16} color="#c4b5fd" /></div>}
                  
                  <div style={{
                    maxWidth: '75%',
                    padding: '1rem 1.2rem',
                    borderRadius: '20px',
                    lineHeight: '1.6',
                    fontSize: '1.05rem',
                    background: isUser ? 'linear-gradient(135deg, var(--accent-primary) 0%, rgba(139, 92, 246, 0.8) 100%)' : 'rgba(15, 23, 42, 0.6)',
                    color: isUser ? 'white' : 'var(--text-primary)',
                    border: isUser ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    borderBottomRightRadius: isUser ? '4px' : '20px',
                    borderBottomLeftRadius: !isUser ? '4px' : '20px',
                  }}>
                    {msg.content}
                  </div>
                  
                  {isUser && <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px', borderRadius: '50%', flexShrink: 0 }}><User size={16} color="white" /></div>}
                </div>
              );
            })}
            
            {loading && (
              <div className="fade-in" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '10px' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '50%', flexShrink: 0 }}><Sparkles size={16} color="#c4b5fd" /></div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem 1.5rem', borderRadius: '20px', borderBottomLeftRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px' }}>
                   <div className="dot-typing"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(3, 0, 20, 0.8)', borderTop: '1px solid var(--glass-border)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the stars a question..."
                className="form-input"
                style={{ flexGrow: 1, borderRadius: '99px', paddingLeft: '1.5rem' }}
                disabled={loading}
              />
              <button type="submit" className="btn-primary" disabled={loading || !input.trim()} style={{ width: '50px', height: '50px', padding: '0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          </div>
          
        </div>
      </div>
      
      <style>{`
        .dot-typing {
          position: relative;
          color: var(--accent-primary);
          width: 6px;
          height: 6px;
          border-radius: 5px;
          animation: dot-typing 1.5s infinite linear;
        }
        @keyframes dot-typing {
          0% { box-shadow: 10px 0 0 0 var(--accent-primary), 24px 0 0 0 rgba(139,92,246,0.2), 38px 0 0 0 rgba(139,92,246,0.2); }
          25% { box-shadow: 10px 0 0 0 rgba(139,92,246,0.2), 24px 0 0 0 var(--accent-primary), 38px 0 0 0 rgba(139,92,246,0.2); }
          50% { box-shadow: 10px 0 0 0 rgba(139,92,246,0.2), 24px 0 0 0 rgba(139,92,246,0.2), 38px 0 0 0 var(--accent-primary); }
          75% { box-shadow: 10px 0 0 0 rgba(139,92,246,0.2), 24px 0 0 0 var(--accent-primary), 38px 0 0 0 rgba(139,92,246,0.2); }
          100% { box-shadow: 10px 0 0 0 var(--accent-primary), 24px 0 0 0 rgba(139,92,246,0.2), 38px 0 0 0 rgba(139,92,246,0.2); }
        }
      `}</style>
    </>
  );
};

export default Chat;
