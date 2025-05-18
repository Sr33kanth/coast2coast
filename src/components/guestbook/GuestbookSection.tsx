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
        </div>
      </div>
    </div>
  </section>
);

export default GuestbookSection;
