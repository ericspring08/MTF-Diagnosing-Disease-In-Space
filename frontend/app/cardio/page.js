import React, { useState, useEffect } from 'react';
import BasicsForm from './BasicsForm';
import EKGForm from './EKGForm';
import BloodWork from './BloodWorkForm';
import axios from 'axios';

const BloodWorkPage = () => {
  const [formIndex, setFormIndex] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
  });

  const [formsCompleted, setFormsCompleted] = useState(false);

  const ConditionalForm = () => {
    switch (formIndex) {
      case 0:
        return <BasicsForm formData={formData} setFormData={setFormData} updateFormCompletion={setFormsCompleted} />;
      case 1:
        return <BloodWork formData={formData} setFormData={setFormData} updateFormCompletion={setFormsCompleted} />;
      case 2:
        return <EKGForm formData={formData} setFormData={setFormData} updateFormCompletion={setFormsCompleted} />;
      default:
        return <BasicsForm formData={formData} setFormData={setFormData} updateFormCompletion={setFormsCompleted} />;
    }
  };

  const handleSubmit = async () => {
    const res = await axios.post(
      'https://nasahunchapi.onrender.com/hdd',
      formData
    );
    console.log(res.data);
    alert(
      `Prediction: ${res.data.prediction} \n Probability: ${res.data.probability}`
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="bg-white p-8 rounded-md shadow-md dark:bg-black">
        <h1 className="text-2xl font-semibold mb-6">
          Cardiovascular Disease Risk Calculator
        </h1>
        {ConditionalForm()}
        <div className="flex">
          {formIndex !== 0 && (
            <button
              onClick={() => setFormIndex(formIndex - 1)}
              className="btn mr-5"
            >
              Previous
            </button>
          )}
          {formIndex !== 2 && (
            <button
              onClick={() => setFormIndex(formIndex + 1)}
              className={`btn ml-5 ${
                !formsCompleted ? 'disabled' : ''
              }`}
              disabled={!formsCompleted}
            >
              Next
            </button>
          )}
          {formIndex === 2 && (
            <button
              onClick={handleSubmit}
              className={`btn ml-5 ${
                !formsCompleted ? 'disabled' : ''
              }`}
              disabled={!formsCompleted}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodWorkPage;
