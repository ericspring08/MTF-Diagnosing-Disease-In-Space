import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  const surveyLink = 'https://nasahunch.vercel.app/survey';
  const heartLink = 'https://nasahunch.vercel.app/cardio';
  const respLink = 'https://nasahunch.vercel.app/resp';

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
        <Link href={surveyLink}>
          <a
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full shadow-md focus:outline-none text-4xl font-semibold mr-4"
            target="_blank" rel="noopener noreferrer"
          >
            Basics
          </a>
        </Link>
        <Link href={heartLink}>
          <a
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full shadow-md focus:outline-none text-4xl font-semibold mr-4"
            target="_blank" rel="noopener noreferrer"
          >
            Cardiovascular
          </a>
        </Link>
        <Link href={respLink}>
          <a
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full shadow-md focus:outline-none text-4xl font-semibold"
            target="_blank" rel="noopener noreferrer"
          >
            Respiratory
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
