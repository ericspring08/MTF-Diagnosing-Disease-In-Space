import React, { useState } from 'react';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    asthma: '',
    o2Saturation: '',
    pefr: '',
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
        <label htmlFor="asthma" className="block text-gray-700 font-semibold mb-2">
          Asthma
        </label>
        <select
          id="asthma"
          name="asthma"
          value={formData.asthma}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Do you have asthma?</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="o2Saturation" className="block text-gray-700 font-semibold mb-2">
          O2 Saturation Level
        </label>
        <input
          type="number"
          id="o2Saturation"
          name="o2Saturation"
          value={formData.o2Saturation}
          onChange={handleChange}
          placeholder="Enter O2 saturation level"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pefr" className="block text-gray-700 font-semibold mb-2">
          PEFR
        </label>
        <input
          type="number"
          id="pefr"
          name="pefr"
          value={formData.pefr}
          onChange={handleChange}
          placeholder="Enter PEFR"
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

export default HeartDiseaseForm;
