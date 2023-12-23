import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const HeartDiseaseForm = () => {
  const respLink = 'https://nasahunch.vercel.app/morecardio';
  const [formData, setFormData] = useState({
    sex: '',
    age: '',
    chestPain: '',
    exerciseInducedAngina: '',
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

    const requiredFields = ['sex', 'age', 'chestPain', 'exerciseInducedAngina'];

    const isAnyFieldEmpty = requiredFields.some((field) => !formData[field]);

    if (isAnyFieldEmpty) {
    window.alert('Please fill out all required fields');
    console.log('Please fill out all required fields');
    return;
  }

    setUserInputs((prevInputs) => [...prevInputs, formData]);

    setFormData({
      sex: '',
      age: '',
      chestPain: '',
      exerciseInducedAngina: '',
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
          <option value="male">Male</option>
          <option value="female">Female</option>
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
  <label htmlFor="chestPain" className="block text-gray-700 font-semibold mb-2">
    Chest Pain
  </label>
  <select
    id="chestPain"
    name="chestPain"
    value={formData.chestPain}
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
        <label htmlFor="exerciseInducedAngina" className="block text-gray-700 font-semibold mb-2">
          Exercise Induced Angina
        </label>
        <select
          id="exerciseInducedAngina"
          name="exerciseInducedAngina"
          value={formData.exerciseInducedAngina}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Do you have exercise-induced angina?</option>
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
