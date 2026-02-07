import React from 'react';
import PhotoGallery from '../components/photos/PhotoGallery';

import { Camera } from 'lucide-react';

const PhotosPage: React.FC = () => {
  // Temporary userId for demo purposes - in a real app, this would come from auth
  

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Camera className="w-8 h-8 mr-2" />
            Road Trip Photo Gallery
          </h1>
          <p className="max-w-2xl opacity-90">
            Capturing memories from coast to coast. Check out our latest photos from the journey, 
            each one pinned to our interactive map so you can see exactly where they were taken.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Latest Photos</h2>
            <PhotoGallery />
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;