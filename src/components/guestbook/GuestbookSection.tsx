import React from 'react';
import GuestbookList from './GuestbookList';

const GuestbookSection: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto mt-16">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-2xl font-bold mb-8 text-center">Guestbook</h3>
        <div className="max-w-3xl mx-auto">
          <h4 className="text-lg font-semibold mb-4">Messages from Travelers & Friends</h4>
          <GuestbookList />
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;
