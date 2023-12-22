'use client'
import React from 'react';
import BloodWorkForm from './BloodWorkForm1';

const BloodWorkPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="bg-white p-8 rounded-md shadow-md dark:bg-black">
        <h1 className="text-2xl font-semibold mb-4 dark:text-white">Blood Work Information</h1>
        <BloodWorkForm />
      </div>
    </div>
  );
};

export default BloodWorkPage;