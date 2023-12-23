import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const HeartDiseaseForm = () => {
  const respLink = 'https://nasahunch.vercel.app/resp';
  const [formData, setFormData] = useState({
    restingECG: '',
    maxHeartRate: '',
    oldpeak: '',
    slope: '',
    numMajorVessels: '',
    thal: '',
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

    const requiredFields = ['restingECG', 'maxHeartRate', 'oldpeak', 'slope', 'numMajorVessels', 'thal'];

    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    if (isAnyFieldEmpty) {
    window.alert('Please fill out all required fields');
    console.log('Please fill out all required fields');
    return;
  }

    setUserInputs((prevInputs) => [...prevInputs, formData]);

    setFormData({
      restingECG: '',
      maxHeartRate: '',
      oldpeak: '',
      slope: '',
      numMajorVessels: '',
      thal: '',
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
        <label htmlFor="restingECG" className="block text-gray-700 font-semibold mb-2">
          Resting ECG
        </label>
        <input
          type="number"
          id="restingECG"
          name="restingECG"
          value={formData.restingECG}
          onChange={handleChange}
          placeholder="Enter resting ECG (0, 1, or 2)"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      {/* Rest of the form inputs remain the same */}
      
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
