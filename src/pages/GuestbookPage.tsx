import React from 'react';
import GuestbookList from '../components/guestbook/GuestbookList';
import { MessageSquare } from 'lucide-react';

const GuestbookPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <MessageSquare className="w-8 h-8 mr-2" />
            Road Trip Guestbook
          </h1>
          <p className="max-w-2xl opacity-90">
            Messages from friends and fellow travelers who followed along on our coast-to-coast journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Messages from Travelers & Friends</h2>
          <GuestbookList />
        </div>
      </div>
    </div>
  );
};

export default GuestbookPage;
