import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const HeartDiseaseForm = () => {
  const respLink = 'https://nasahunch.vercel.app/evenmorecardio';
  const [formData, setFormData] = useState({
    restingBloodPressure: '',
    serumCholesterol: '',
    fastingBloodSugar: '',
  });

  const [userInputs, setUserInputs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['restingBloodPressure', 'serumCholesterol', 'fastingBloodSugar'];

    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    if (isAnyFieldEmpty) {
    window.alert('Please fill out all required fields');
    console.log('Please fill out all required fields');
    return;
  }

    setUserInputs((prevInputs) => [...prevInputs, formData]);

    setFormData({
      restingBloodPressure: '',
      serumCholesterol: '',
      fastingBloodSugar: '',
    });
  };

  const sendToServer = async () => {
    try {
      const response = await axios.post('https://your-backend-server.com/api/store-inputs', {
        userInputs,
      });
      console.log('User inputs sent:', response.data);
    } catch (error) {
      console.error('Error sending user inputs:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="restingBloodPressure" className="block text-gray-700 font-semibold mb-2">
          Resting Blood Pressure
        </label>
        <input
          type="number"
          id="restingBloodPressure"
          name="restingBloodPressure"
          value={formData.restingBloodPressure}
          onChange={handleChange}
          placeholder="Enter resting blood pressure"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="serumCholesterol" className="block text-gray-700 font-semibold mb-2">
          Serum Cholesterol
        </label>
        <input
          type="number"
          id="serumCholesterol"
          name="serumCholesterol"
          value={formData.serumCholesterol}
          onChange={handleChange}
          placeholder="Enter serum cholesterol"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="fastingBloodSugar" className="block text-gray-700 font-semibold mb-2">
          Fasting Blood Sugar &gt;120mg/dl
        </label>
        <select
          id="fastingBloodSugar"
          name="fastingBloodSugar"
          value={formData.fastingBloodSugar}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Fasting Blood Sugar &gt;120mg/dl?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <Link href={respLink}>
        <div className="mt-6">
          <button
            type="submit"
            onClick={sendToServer}
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
