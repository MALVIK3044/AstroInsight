import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Kundli from './pages/Kundli';
import Horoscope from './pages/Horoscope';
import Numerology from './pages/Numerology';
import Dosha from './pages/Dosha';
import Match from './pages/Match';
import AskAI from './pages/AskAI';
import History from './pages/History';
import Tarot from './pages/Tarot';
import Admin from './pages/Admin';
import { Compass, LogOut } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0c1a]"><div className="spinner"></div></div>;

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0a0c1a] relative overflow-hidden">
        
        {/* Nebula Background Effects */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
           <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]"></div>
           <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]"></div>
           <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[130px]"></div>
        </div>

        {/* Global Dark Theme Website Logo Watermark */}
        <div className="fixed top-1/2 left-1/2 md:left-[calc(50%+8rem)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03]">
           <Compass size={850} className="text-amber-400 animate-[spin_120s_linear_infinite]" />
        </div>

        {user && <Sidebar />}
        <div className={`flex-1 flex flex-col relative z-10 ${user ? 'ml-64' : ''} w-full min-h-screen px-4 md:px-8 pb-8 pt-24`}>
          {user && (
            <div className="absolute top-0 right-0 w-full p-4 md:p-6 flex justify-end z-50 pointer-events-none">
              <button onClick={logout} className="pointer-events-auto flex items-center gap-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:border-rose-500 hover:text-white border border-rose-500/20 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-rose-500/10 text-sm">
                <LogOut size={16} /> Secure Logout
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/kundli" element={<PrivateRoute><Kundli /></PrivateRoute>} />
            <Route path="/horoscope" element={<PrivateRoute><Horoscope /></PrivateRoute>} />
            <Route path="/numerology" element={<PrivateRoute><Numerology /></PrivateRoute>} />
            <Route path="/dosha" element={<PrivateRoute><Dosha /></PrivateRoute>} />
            <Route path="/match" element={<PrivateRoute><Match /></PrivateRoute>} />
            <Route path="/ask-ai" element={<PrivateRoute><AskAI /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/tarot" element={<PrivateRoute><Tarot /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
