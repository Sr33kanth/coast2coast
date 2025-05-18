import React from 'react';
import GuestbookForm from '../components/guestbook/GuestbookForm';
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
            Leave your mark on our journey! Sign our digital guestbook with well-wishes, 
            travel tips, or memories from your own road trips. We'd love to hear from you!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-2xl font-bold mb-6">Messages from Travelers & Friends</h2>
            <GuestbookList />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6">Leave a Message</h2>
            <GuestbookForm />
            
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h3 className="font-bold text-lg mb-4">Traveler's Wisdom</h3>
              <div className="italic text-slate-600 border-l-4 border-purple-200 pl-4 py-2">
                "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."
                <div className="text-right mt-2 text-sm font-medium">— Marcel Proust</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestbookPage;