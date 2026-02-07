
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import PhotosPage from './pages/PhotosPage';
import GuestbookPage from './pages/GuestbookPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/guestbook" element={<GuestbookPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
