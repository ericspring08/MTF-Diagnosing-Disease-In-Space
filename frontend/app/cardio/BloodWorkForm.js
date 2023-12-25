import React, { useState } from 'react';
import axios from 'axios';

const HeartDiseaseForm = ({ formData, setFormData }) => {
     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(() => ({
               ...formData,
               [name]: value,
          }));
     };

     return (
          <div className="max-w-lg mx-auto">
               <h1 className="text-6xl mb-2">Blood Work</h1>
               <div className="mb-4">
                    <label
                         htmlFor="trestbps"
                         className="block text-gray-700 font-semibold mb-2"
                    >
                         Resting Blood Pressure
                    </label>
                    <input
                         type="number"
                         id="trestbps"
                         name="trestbps"
                         value={formData.trestbps}
                         onChange={handleChange}
                         placeholder="Enter resting blood pressure (mm of Hg)"
                         className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
               </div>
               <div className="mb-4">
                    <label
                         htmlFor="chol"
                         className="block text-gray-700 font-semibold mb-2"
                    >
                         Serum Cholesterol
                    </label>
                    <input
                         type="number"
                         id="chol"
                         name="chol"
                         value={formData.chol}
                         onChange={handleChange}
                         placeholder="Enter serum cholesterol mg/dL"
                         className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
               </div>
               <div className="mb-4">
                    <label
                         htmlFor="fbs"
                         className="block text-gray-700 font-semibold mb-2"
                    >
                         Fasting Blood Sugar &gt;120mg/dl
                    </label>
                    <select
                         id="fbs"
                         name="fbs"
                         value={formData.fbs}
                         onChange={handleChange}
                         className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    >
                         <option value="">
                              Fasting Blood Sugar &gt;120mg/dl?
                         </option>
                         <option value="1">Yes</option>
                         <option value="0">No</option>
                    </select>
               </div>
          </div>
     );
};

export default HeartDiseaseForm;
