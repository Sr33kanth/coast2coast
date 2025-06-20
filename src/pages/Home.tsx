import React, { useState, useEffect } from 'react';
import Hero from '../components/layout/Hero';
import MapView from '../components/map/MapView';

import { formatDate } from '../utils/helpers';
import { getCheckIns } from '../services/checkins';
import { getPhotos } from '../services/photos';
import AboutSection from '../components/layout/AboutSection';
import GuestbookSection from '../components/guestbook/GuestbookSection';

const Home: React.FC = () => {
  // Temporary userId for demo purposes - in a real app, this would come from auth
  
  const [checkIns, setCheckIns] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState({
    daysOnRoad: 0,
    distance: 0,
    states: 0,
    photos: 0
  });
  const [roadDistance, setRoadDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const checkInsData = await getCheckIns();
      const photosData = await getPhotos();
      setCheckIns(checkInsData);
      setPhotos(photosData);
      // Calculate stats
      let daysOnRoad = 0;
      let distance = 0;
      let states = 0;
      if (checkInsData.length > 0) {
        // Days on road: difference between first and last check-in
        const dates = checkInsData.map(ci => new Date(ci.timestamp));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        daysOnRoad = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        // Distance covered: sum of distances between consecutive check-ins (fallback if roadDistance not available)
        const toRad = (deg: number) => deg * Math.PI / 180;
        const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 3958.8; // Radius of earth in miles
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };
        for (let i = 1; i < checkInsData.length; i++) {
          distance += haversine(
            checkInsData[i-1].lat, checkInsData[i-1].lng,
            checkInsData[i].lat, checkInsData[i].lng
          );
        }
        // States visited: count unique state names from location string (assume last part after comma is state)
        const stateSet = new Set(
          checkInsData.map(ci => {
            const parts = ci.location.split(',');
            // Try to extract 2-letter state code or last word
            let state = parts.length > 1 ? parts[parts.length-1].trim() : '';
            // If state is not 2 letters, try last word
            if (state && state.length !== 2) {
              const words = state.split(' ');
              state = words[words.length-1];
            }
            return state;
          }).filter(Boolean)
        );
        states = stateSet.size;
        if (states === 0) {
          // Debug: log check-in locations
          // eslint-disable-next-line no-console
          console.log('Check-in locations for state extraction:', checkInsData.map(ci => ci.location));
        }
      }
      setStats({
        daysOnRoad,
        distance: Math.round(roadDistance ?? distance),
        states: 16, // Hardcoded as trip is over
        photos: photosData.length
      });
    };
    fetchData();
  }, [roadDistance]);
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <Hero />
      
      <div className="container mx-auto px-4 py-12" id="latest-update">
        <h2 className="text-3xl font-bold text-center mb-8">Follow Our Journey</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map */}
          <div className="lg:col-span-2">
            <MapView onRouteDistanceChange={miles => setRoadDistance(miles)} />
            
            {/* About and Guestbook now moved below grid */}
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

            {/* TEMP DEBUG: Show all check-in locations */}
            {checkIns.length > 0 && (
              <div className="bg-yellow-50 rounded-xl shadow-md p-4 mt-4">
                <h4 className="font-bold text-yellow-800 mb-2 text-sm">Debug: All Check-in Locations</h4>
                <ul className="text-xs text-yellow-900 space-y-1">
                  {checkIns.map((ci, i) => (
                    <li key={ci.id || i}>{ci.location || <span className="italic text-yellow-600">(no location)</span>}</li>
                  ))}
                </ul>
              </div>
            )}

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