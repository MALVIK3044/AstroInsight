import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MoonStar } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo');

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="navbar-wrapper fade-in">
      <nav className="navbar container">
        <Link to="/" className="nav-brand">
          <MoonStar className="logo-icon floating" size={32} />
          <span>AstroInsight</span>
        </Link>
        <div className="nav-links">
          {userInfo ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
              {JSON.parse(userInfo).isAdmin && (
                <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin</Link>
              )}
              <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>AI Astrologer</Link>
              <Link to="/compatibility" className={`nav-link ${isActive('/compatibility')}`}>Synastry</Link>
              <button onClick={logoutHandler} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>Login</Link>
              <Link to="/register" className="btn-primary">Discover Yourself</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
