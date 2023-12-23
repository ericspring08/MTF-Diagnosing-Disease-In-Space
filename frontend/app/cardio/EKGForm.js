import React, {useState} from 'react';

const HeartDiseaseForm = ({formData, setFormData}) => {
  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(() => ({
            ...formData,
            [name]: value,
        }));
  };

  return (
      <div className="max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="thalach" className="block text-gray-700 font-semibold mb-2">
          Maximum Heart Rate
        </label>
        <input
          type="number"
          id="thalach"
          name="thalach"
          value={formData.thalach}
          onChange={handleChange}
          placeholder="Enter maximum heart rate (bpm)"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
          <label htmlFor="restecg">
                Resting Electrocardiographic Results
          </label>
          <select
            id="restecg"
            name="restecg"
            value={formData.restecg}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select resting electrocardiographic results</option>
            <option value="0">0 - Normal</option>
            <option value="1">1 - Abnormality</option>
            <option value="2">2 - Showing probable or definite left ventricular hypertrophy</option>
          </select>
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
          placeholder="Enter oldpeak (slope)"
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
        <label htmlFor="ca" className="block text-gray-700 font-semibold mb-2">
          Number of Major Vessels Colored by Fluorosopy
        </label>
        <select
            id="ca"
            name="ca"
            value={formData.ca}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            >
            <option value="">Select number of major vessels</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="thal" className="block text-gray-700 font-semibold mb-2">
          Thalassemia
        </label>
        <select
          id="thal"
          name="thal"
          value={formData.thal}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Thal</option>
          <option value="1">Normal</option>
          <option value="2">Fixed Defect</option>
          <option value="3">Reversible Defect</option>
        </select>
      </div>
      </div>
  );
};


export default HeartDiseaseForm;
