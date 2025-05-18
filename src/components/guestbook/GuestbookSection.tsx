import React from 'react';
import GuestbookForm from './GuestbookForm';
import GuestbookList from './GuestbookList';

const GuestbookSection: React.FC = () => (
  <section className="w-full max-w-6xl mx-auto mt-16">
    <div className="bg-white rounded-xl shadow-md p-8">
      <h3 className="text-2xl font-bold mb-8 text-center">Guestbook</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 order-2 md:order-1">
          <h4 className="text-lg font-semibold mb-4">Messages from Travelers & Friends</h4>
          <GuestbookList />
        </div>
        <div className="order-1 md:order-2">
          <h4 className="text-lg font-semibold mb-4">Leave a Message</h4>
          <GuestbookForm />
          <div className="bg-white rounded-xl shadow-md p-4 mt-8">
            <h5 className="font-bold text-base mb-2">Traveler's Wisdom</h5>
            <div className="italic text-slate-600 border-l-4 border-purple-200 pl-4 py-2">
              "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."
              <div className="text-right mt-2 text-xs font-medium">— Marcel Proust</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GuestbookSection;
