import React from 'react';
import { Link } from 'react-router-dom';
import { Stars, Compass, Sparkles, Moon, Sun, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <>
      <div className="ambient-light"></div>
      <div className="ambient-light-2"></div>
      
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="hero-section text-center" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          <div className="slide-up" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
            <Sun size={20} />
            <Moon size={20} />
            <Stars size={20} />
          </div>

          <h1 className="text-gradient slide-up stagger-1" style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Unveil Your Cosmic Destiny
          </h1>
          
          <p className="slide-up stagger-2" style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3.5rem auto', lineHeight: '1.8' }}>
            AstroInsight merges ancient astrological wisdom with cutting-edge Artificial Intelligence. 
            Receive hyper-personalized readings for <strong style={{color: 'white'}}>Love, Career, and Destiny</strong> based on your precise birth chart.
          </p>
          
          <div className="slide-up stagger-3" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '6rem' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
              Begin Your Journey <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </Link>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            
            <div className="feature-card glass-panel slide-up stagger-2" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <Sparkles size={40} className="text-gradient-purple" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'white' }}>Natal AI Readings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Deep analysis explicitly tailored to your precise planetary placements and aspects.</p>
            </div>
            
            <div className="feature-card glass-panel slide-up stagger-3" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ background: 'rgba(236, 72, 153, 0.15)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <Compass size={40} color="#ec4899" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'white' }}>Life Domains</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Targeted cosmic guidance across career crossroads, health, relationships, and wealth.</p>
            </div>
            
            <div className="feature-card glass-panel slide-up stagger-4" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ background: 'rgba(251, 191, 36, 0.15)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <Stars size={40} color="#fbbf24" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'white' }}>AI Astrologer Chat</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>Speak directly to an AI Consultant that knows your chart inside and out.</p>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
