import React, { useState } from 'react';
import RouteEditor from '../components/routes/RouteEditor';
import { Route, Lock } from 'lucide-react';

const AdminPage: React.FC = () => {
  // Temporary userId for demo purposes - in a real app, this would come from auth
  const [userId] = useState<string>('demo-user-id');
  // In a real app, this would be determined by actual authentication
  const [isAuthenticated] = useState<boolean>(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="bg-white rounded-xl shadow-md p-10 max-w-md">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Admin Access Only</h2>
            <p className="text-slate-500 mb-6">
              You need to be authenticated as an admin to access this page.
            </p>
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Route className="w-8 h-8 mr-2" />
            Trip Admin Panel
          </h1>
          <p className="max-w-2xl opacity-90">
            Manage your journey's route, add planned stops, and update your progress
            as you make your way from coast to coast.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Route Management</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <RouteEditor userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;