import React, { useState } from 'react';
import Hero from '../components/layout/Hero';
import MapView from '../components/map/MapView';
import CheckinForm from '../components/checkins/CheckinForm';
import { formatDate } from '../utils/helpers';

const Home: React.FC = () => {
  // Temporary userId for demo purposes - in a real app, this would come from auth
  const [userId] = useState<string>('demo-user-id');
  
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
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">About Our Trip</h3>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="mb-4">
                  We're embarking on an epic coast-to-coast road trip across America, from the iconic Golden Gate Bridge in San Francisco to the towering Empire State Building in New York City. Along the way, we'll be documenting our adventures, sharing photos, and checking in from various locations.
                </p>
                <p className="mb-4">
                  Our journey will take us through stunning national parks, quirky roadside attractions, bustling cities, and charming small towns. We plan to explore hidden gems, try local cuisines, and immerse ourselves in the diverse cultures that make America so unique.
                </p>
                <p>
                  We invite you to follow along, leave comments, and experience this adventure with us in real-time through our interactive map and photo gallery. Feel free to sign our digital guestbook and share your own road trip tips or experiences!
                </p>
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-700">Start</h4>
                    <p>San Francisco, CA</p>
                    <p className="text-sm text-blue-500">{formatDate('2025-01-01')}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-700">Finish</h4>
                    <p>New York, NY</p>
                    <p className="text-sm text-purple-500">{formatDate('2025-01-21')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <CheckinForm userId={userId} />

            <div id="current-stats" className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Trip Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Days on Road</span>
                  <span className="font-bold text-lg">12</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Distance Covered</span>
                  <span className="font-bold text-lg">1,487 miles</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">States Visited</span>
                  <span className="font-bold text-lg">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Photos Shared</span>
                  <span className="font-bold text-lg">34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;