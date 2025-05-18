import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Camera, MessageSquare, Route, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Map', path: '/', icon: <Map className="w-5 h-5" /> },
    { name: 'Photos', path: '/photos', icon: <Camera className="w-5 h-5" /> },
    { name: 'Guestbook', path: '/guestbook', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Admin', path: '/admin', icon: <Route className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
            >
              <Map className="w-5 h-5 text-white" />
            </motion.div>
            <span className={`font-bold text-xl transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              Coast2Coast
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={location.pathname === item.path ? 'primary' : 'ghost'} 
                  size="sm"
                  className={location.pathname === item.path ? '' : `${isScrolled ? 'text-slate-700' : 'text-white'}`}
                  icon={item.icon}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 rounded-md ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 px-2 bg-white rounded-b-lg shadow-lg"
          >
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="w-full">
                  <Button 
                    variant={location.pathname === item.path ? 'primary' : 'ghost'} 
                    size="sm"
                    className="w-full justify-start"
                    icon={item.icon}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;