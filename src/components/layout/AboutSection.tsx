import React from 'react';

const AboutSection: React.FC = () => (
  <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:gap-10">
      <div className="flex-1 text-center">
        <h3 className="storybook-title text-3xl font-bold mb-6">About Our Trip</h3>
        <p className="storybook-font mb-4 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
          We're embarking on an epic coast-to-coast road trip across America, from the Golden Gate Bridge in San Francisco to the Empire State Building in New York City.
        </p>
        <p className="storybook-font mb-4 text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
          Along the way, we'll document our adventures, share photos, and check in from various locations—exploring national parks, quirky roadside attractions, cities, and small towns.
        </p>
        <p className="storybook-font text-lg md:text-xl leading-relaxed mx-auto max-w-2xl">
          Follow along, leave comments, and experience this adventure with us in real-time through our interactive map, photo gallery, and guestbook below!
        </p>
      </div>
      <img src="/trip_map.jpeg" alt="Trip Map" className="w-full md:w-72 rounded-lg shadow-md object-cover mt-6 md:mt-0" />
    </div>
    {/* Traveler's Wisdom Block */}
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h5 className="font-bold text-base mb-2">Traveler's Wisdom</h5>
        <div className="italic text-slate-600 border-l-4 border-purple-200 pl-4 py-2">
          "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."
          <div className="text-right mt-2 text-xs font-medium">— Marcel Proust</div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
