import React, { useState } from 'react';
import PhotoGallery from '../components/photos/PhotoGallery';
import PhotoUpload from '../components/photos/PhotoUpload';
import { Camera } from 'lucide-react';

const PhotosPage: React.FC = () => {
  // Temporary userId for demo purposes - in a real app, this would come from auth
  const [userId] = useState<string>('demo-user-id');

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
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Share a Photo</h2>
            <PhotoUpload userId={userId} />
            
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h3 className="font-bold text-lg mb-4">Photo Tips</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="inline-block bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  Enable location services for accurate pinning on our map
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  Add descriptive captions to help tell the story
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  Photos must be under 5MB in size
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  Supported formats: JPEG, PNG, and WebP
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;