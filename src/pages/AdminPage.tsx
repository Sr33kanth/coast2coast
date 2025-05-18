import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import RouteEditor from '../components/routes/RouteEditor';
import CheckinForm from '../components/checkins/CheckinForm';
import PhotoUpload from '../components/photos/PhotoUpload';
import { Route } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null; // Should be protected by route, but just in case

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 mb-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Route className="w-8 h-8 mr-2" />
              Trip Admin Panel
            </h1>
            <div className="text-sm opacity-80">Signed in as: <span className="font-mono">{user.email}</span></div>
          </div>
          <button
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors shadow"
            onClick={signOut}
          >
            Log Out
          </button>
        </div>
        <p className="max-w-2xl opacity-90">
          Manage your journey's route, add planned stops, and update your progress
          as you make your way from coast to coast.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Route Management</h2>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <RouteEditor userId={user.id} />
            </div>
          </div>
          {/* Admin-only: Check-in and Photo Upload */}
          <div className="lg:col-span-1 space-y-8">
            <CheckinForm userId={user.id} />
            <PhotoUpload userId={user.id} adminMode />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;