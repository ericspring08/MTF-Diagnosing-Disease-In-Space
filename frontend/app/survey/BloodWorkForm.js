import React, { useState } from 'react';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    sex: '',
    bmi: '',
    dm: '',
    htn: '',
    currentSmoker: '',
    exSmoker: '',
    fh: '',
    obesity: '',
    crf: '',
    cva: '',
    airwayDisease: '',
    thyroidDisease: '',
    chf: '',
    dlp: '',
    bp: '',
    pr: '',
    edema: '',
    weakPeripheralPulse: '',
    lungRales: '',
    systolicMurmur: '',
    diastolicMurmur: '',
    typicalChestPain: '',
    dyspnea: '',
    functionClass: '',
    atypical: '',
    nonanginalCP: '',
    exertionalCP: '',
    lowThAng: '',
    eCG: '',
    qWave: '',
    stElevation: '',
    stDepression: '',
    tInversion: '',
    lvh: '',
    poorRProgression: '',
    fbs: '',
    cr: '',
    tg: '',
    ldl: '',
    hdl: '',
    bun: '',
    esr: '',
    hb: '',
    k: '',
    na: '',
    wbc: '',
    lymph: '',
    neut: '',
    plt: '',
    ef: '',
    regionWithRwma: '',
    vhd: '',
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
      {/* Weight */}
      <div className="mb-4">
        <label htmlFor="weight" className="block text-gray-700 font-semibold mb-2">
          Weight
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      {/* Sex */}
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
      <div className="mt-6">
      </div>
      {/*new attribute*/}
      <div className="mb-4">
        <label htmlFor="Current Smoker" className="block text-gray-700 font-semibold mb-2">
          Current Smoker
        </label>
        <select
          id="currentsmoker"
          name="currentsmoker"
          value={formData.currentSmoker}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Current Smoker?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
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
