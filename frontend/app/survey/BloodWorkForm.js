
import React, { useState } from 'react';

const BloodWorkForm = () => {
  const [formData, setFormData] = useState({
    cholesterol: '',
    wbcCount: '',
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
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="cholesterol" className="block text-gray-700 font-semibold mb-2 dark:text-gray-100">
          Cholesterol
        </label>
        <input
          type="text"
          id="cholesterol"
          name="cholesterol"
          value={formData.cholesterol}
          onChange={handleChange}
          placeholder="Enter cholesterol level"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="wbcCount" className="block text-gray-700 font-semibold mb-2 dark:text-gray-100">
          WBC Count
        </label>
        <input
          type="text"
          id="wbcCount"
          name="wbcCount"
          value={formData.wbcCount}
          onChange={handleChange}
          placeholder="Enter WBC count"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default BloodWorkForm;