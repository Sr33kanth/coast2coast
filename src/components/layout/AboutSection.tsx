import React from 'react';

const AboutSection: React.FC = () => (
  <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:gap-10">
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-4">About Our Trip</h3>
        <p className="mb-2 text-base md:text-lg">
          We're embarking on an epic coast-to-coast road trip across America, from the Golden Gate Bridge in San Francisco to the Empire State Building in New York City.
        </p>
        <p className="mb-2 text-base md:text-lg">
          Along the way, we'll document our adventures, share photos, and check in from various locations—exploring national parks, quirky roadside attractions, cities, and small towns.
        </p>
        <p className="text-base md:text-lg">
          Follow along, leave comments, and experience this adventure with us in real-time through our interactive map, photo gallery, and guestbook below!
        </p>
      </div>
      <img src="/trip-map.jpeg" alt="Trip Map" className="w-full md:w-72 rounded-lg shadow-md object-cover mt-6 md:mt-0" />
    </div>
  </section>
);

export default AboutSection;
