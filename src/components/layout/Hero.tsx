import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      parallaxRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-900">
      {/* Parallax Background */}
      <div ref={parallaxRef} className="absolute inset-0">
        {/* Background City Images */}
        <div className="absolute left-0 bottom-0 w-1/3 h-2/3 bg-[url('https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg')] bg-cover bg-center opacity-30" />
        <div className="absolute right-0 bottom-0 w-1/3 h-2/3 bg-[url('https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg')] bg-cover bg-center opacity-30" />

        {/* Animated Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Dotted Line Representing the Route */}
      <div className="absolute top-1/2 left-0 right-0 h-1 flex items-center justify-between px-20 md:px-32">
        <div className="absolute w-full h-[3px] bg-white/20 -z-10"></div>
        <div className="w-full h-0.5 border-t-2 border-dashed border-white/50"></div>
      </div>





      {/* Content: Move heading and subtitle higher */}
      <div className="relative h-full flex flex-col items-center justify-start pt-32 text-white text-center px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Coast to Coast
        </motion.h1>
        <motion.div
          className="text-xl md:text-2xl mb-8 max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p>
            Follow our epic road trip journey from the Golden Gate to the Empire State
          </p>
        </motion.div>
        {/* Photo Gallery Button */}
        <div className="flex justify-center mt-6">
          <a
            href="/photos"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-all duration-200 transform hover:scale-105"
          >
            View Photo Gallery
          </a>
        </div>
      </div>
      {/* San Francisco Marker */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute left-16 md:left-32 top-2/3 transform -translate-y-1/2"
      >
        <div className="flex flex-col items-center">
          <MapPin className="w-8 h-8 text-red-500" />
          <div className="mt-2 bg-white/10 backdrop-blur-md rounded-lg p-2">
            <p className="text-white font-bold">San Francisco</p>
            <p className="text-blue-200 text-xs">Starting Point</p>
          </div>
        </div>
      </motion.div>

      {/* New York Marker */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute right-16 md:right-32 top-2/3 transform -translate-y-1/2"
      >
        <div className="flex flex-col items-center">
          <MapPin className="w-8 h-8 text-red-500" />
          <div className="mt-2 bg-white/10 backdrop-blur-md rounded-lg p-2">
            <p className="text-white font-bold">New York</p>
            <p className="text-blue-200 text-xs">Destination</p>
          </div>
        </div>
      </motion.div>


      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        <div className="flex flex-col items-center text-white/80">
          <p className="text-sm mb-2">Scroll to explore</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;