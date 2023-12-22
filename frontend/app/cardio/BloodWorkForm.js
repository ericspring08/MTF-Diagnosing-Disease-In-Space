import React, { useState } from 'react';
import Link from 'next/link';

const HeartDiseaseForm = () => {
    const respLink = 'https://nasahunch.vercel.app/resp';
  const [formData, setFormData] = useState({
    cholesterolLevel: '',
    wbcCount: '',
    rbcCount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="cholesterolLevel" className="block text-gray-700 font-semibold mb-2">
          Cholesterol Level
        </label>
        <input
          type="number"
          id="cholesterolLevel"
          name="cholesterolLevel"
          value={formData.cholesterolLevel}
          onChange={handleChange}
          placeholder="Enter cholesterol level"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="wbcCount" className="block text-gray-700 font-semibold mb-2">
          WBC Count
        </label>
        <input
          type="number"
          id="wbcCount"
          name="wbcCount"
          value={formData.wbcCount}
          onChange={handleChange}
          placeholder="Enter WBC count"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="rbcCount" className="block text-gray-700 font-semibold mb-2">
          RBC Count
        </label>
        <input
          type="number"
          id="rbcCount"
          name="rbcCount"
          value={formData.rbcCount}
          onChange={handleChange}
          placeholder="Enter RBC count"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <Link href={respLink}>
        <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Next
        </button>
      </div>
      </Link>
    </form>
  );
};

export default HeartDiseaseForm;
