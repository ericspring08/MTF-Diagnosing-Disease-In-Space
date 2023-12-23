import React, { useState } from 'react';
import axios from 'axios';

const BasicsForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(() => ({
      ...formData,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-6xl">Basics</h1>
      <div className="mb-4">
        <label htmlFor="sex" className="block text-gray-700 font-semibold mb-2">
          Sex
        </label>
        <select
          id="sex"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select sex</option>
          <option value="1">Male</option>
          <option value="0">Female</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="age" className="block text-gray-700 font-semibold mb-2">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter age"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="cp" className="block text-gray-700 font-semibold mb-2">
          Chest Pain
        </label>
        <select
          id="cp"
          name="cp"
          value={formData.cp}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select chest pain level</option>
          <option value="0">0 - No chest pain</option>
          <option value="1">1 - Mild chest pain</option>
          <option value="2">2 - Moderate chest pain</option>
          <option value="3">3 - Severe chest pain</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="exang"
          className="block text-gray-700 font-semibold mb-2"
        >
          Exercise Induced Angina
        </label>
        <select
          id="exang"
          name="exang"
          value={formData.exang}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Do you have exercise-induced angina?</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>
    </div>
  );
};

export default BasicsForm;
