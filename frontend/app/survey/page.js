'use client'
import React from 'react';
import BloodWorkForm from './BloodWorkForm';

const BloodWorkPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Blood Work Information</h1>
        <BloodWorkForm />
      </div>
    </div>
  );
};

export default BloodWorkPage;