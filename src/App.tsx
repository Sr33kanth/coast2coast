
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import PhotosPage from './pages/PhotosPage';
import GuestbookPage from './pages/GuestbookPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/guestbook" element={<GuestbookPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;