import React, { useState, useEffect } from 'react';
import Hero from '../components/layout/Hero';
import MapView from '../components/map/MapView';
import { getPhotos } from '../services/photos';
import AboutSection from '../components/layout/AboutSection';
import GuestbookSection from '../components/guestbook/GuestbookSection';

const Home: React.FC = () => {
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    getPhotos().then(photos => setPhotoCount(photos.length));
  }, []);

  // Trip stats are now known constants
  const stats = {
    daysOnRoad: 16,
    distance: 3000,
    states: 16,
    photos: photoCount,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <Hero />

      <div className="container mx-auto px-4 py-12" id="latest-update">
        <h2 className="text-3xl font-bold text-center mb-8">Follow Our Journey</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map */}
          <div className="lg:col-span-2">
            <MapView />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            <div id="current-stats" className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Trip Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Days on Road</span>
                  <span className="font-bold text-lg">{stats.daysOnRoad}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Distance Covered</span>
                  <span className="font-bold text-lg">{stats.distance.toLocaleString()} miles</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">States Visited</span>
                  <span className="font-bold text-lg">{stats.states}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Photos Shared</span>
                  <span className="font-bold text-lg">{stats.photos}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* About Section (full width) */}
      <AboutSection />

      {/* Guestbook Section (full width, bottom) */}
      <GuestbookSection />
    </div>
  );
};

export default Home;
