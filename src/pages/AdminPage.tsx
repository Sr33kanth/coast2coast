import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import RouteEditor from '../components/routes/RouteEditor';
import CheckinForm from '../components/checkins/CheckinForm';
import PhotoUpload from '../components/photos/PhotoUpload';
import { Route } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getGuestbookAddresses } from '../services/guestbook';
import type { GuestbookAddress } from '../types';

const AdminPage: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null; // Should be protected by route, but just in case

  const [guestbookAddresses, setGuestbookAddresses] = useState<GuestbookAddress[]>([]);

  useEffect(() => {
    getGuestbookAddresses().then(setGuestbookAddresses);
  }, []);

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

        {/* Guestbook Addresses Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span role="img" aria-label="postcard" className="mr-2">📬</span>
            Guestbook Addresses for Postcards
          </h2>
          {guestbookAddresses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-slate-500 text-center">No addresses submitted yet.</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {guestbookAddresses.map(address => (
                    <tr key={address.id} className="hover:bg-pink-50 transition-colors">
                      <td className="px-4 py-2 font-medium text-slate-900">{address.name}</td>
                      <td className="px-4 py-2 text-slate-700 whitespace-pre-line">{address.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;