import React, { useState } from 'react';
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
      <div className="mb-4">
        <label htmlFor="maxHeartRate" className="block text-gray-700 font-semibold mb-2">
          Maximum Heart Rate
        </label>
        <input
          type="number"
          id="maxHeartRate"
          name="maxHeartRate"
          value={formData.maxHeartRate}
          onChange={handleChange}
          placeholder="Enter maximum heart rate"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="oldpeak" className="block text-gray-700 font-semibold mb-2">
          Oldpeak
        </label>
        <input
          type="number"
          id="oldpeak"
          name="oldpeak"
          value={formData.oldpeak}
          onChange={handleChange}
          placeholder="Enter oldpeak"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="slope" className="block text-gray-700 font-semibold mb-2">
          Slope of Peak Exercise ST Segment
        </label>
        <input
          type="number"
          id="slope"
          name="slope"
          value={formData.slope}
          onChange={handleChange}
          placeholder="Enter slope"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="numMajorVessels" className="block text-gray-700 font-semibold mb-2">
          Number of Major Vessels Colored by Fluorosopy
        </label>
        <input
          type="number"
          id="numMajorVessels"
          name="numMajorVessels"
          value={formData.numMajorVessels}
          onChange={handleChange}
          placeholder="Enter number of major vessels"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="thal" className="block text-gray-700 font-semibold mb-2">
          Thal
        </label>
        <select
          id="thal"
          name="thal"
          value={formData.thal}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Thal</option>
          <option value="normal">Normal</option>
          <option value="fixed defect">Fixed Defect</option>
          <option value="reversible defect">Reversible Defect</option>
        </select>
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
