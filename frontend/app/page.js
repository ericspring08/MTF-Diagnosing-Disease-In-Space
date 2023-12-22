
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="absolute inset-0 overflow-hidden z-0">
        <img
          src="https://i.pinimg.com/736x/82/13/ea/8213ea96c17c9252091ffabef45aeee3.jpg"
          alt="Space"
          className="absolute h-full w-full object-cover"
        />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-white text-6xl font-bold mb-8">Prototype</h1>
        <h1 className="text-white text-6xl font-bold mb-8">Testing</h1>
        <h1 className="text-white text-6xl font-bold mb-8">Framework</h1>
        <Link href="https://nasahunch.vercel.app/survey">
          <a
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full shadow-md focus:outline-none text-4xl font-semibold"
            target="_blank" rel="noopener noreferrer"
          >
            Survey
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
