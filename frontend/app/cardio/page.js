'use client';

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

     const [disableNext, setDisableNext] = useState(true);

     // the features that are required to be filled out for each page
     const features_per_page = {
          0: ['sex', 'age', 'cp', 'exang'],
          1: ['trestbps', 'chol', 'fbs'],
          2: ['thalach', 'restecg', 'oldpeak', 'slope', 'ca', 'thal'],
     };

     // checks every time form data changes or form index changes
     useEffect(() => {
          // get the features that are required to be filled out for the current page
          const features = features_per_page[formIndex];

          // check if any of the features are empty
          let disable = false;
          for (let i = 0; i < features.length; i++) {
               if (formData[features[i]] === '') {
                    disable = true;
                    break;
               }
          }
          // Set the disableNext state to true or false accordingly
          setDisableNext(disable);
     }, [formData, formIndex]);

     const ConditionalForm = () => {
          switch (formIndex) {
               case 0:
                    return (
                         <BasicsForm
                              formData={formData}
                              setFormData={setFormData}
                         />
                    );
               case 1:
                    return (
                         <BloodWork
                              formData={formData}
                              setFormData={setFormData}
                         />
                    );
               case 2:
                    return (
                         <EKGForm
                              formData={formData}
                              setFormData={setFormData}
                         />
                    );
               default:
                    return (
                         <BasicsForm
                              formData={formData}
                              setFormData={setFormData}
                         />
                    );
          }
     };

     const handleSubmit = async () => {
          const res = await axios.post(
               'https://nasahunchapi.onrender.com/hdd',
               formData,
          );
          console.log(res.data);
          alert(
               `Prediction: ${res.data.prediction} \n Probability: ${res.data.probability}`,
          );
     };

     return (
          <div className="bg-gray-100 min-h-screen flex items-center justify-center dark:bg-gray-950">
               <div className="bg-white p-8 rounded-md shadow-md dark:bg-gray-900">
                    <h1 className="text-2xl font-semibold mb-6">
                         Cardiovascular Disease Risk Calculator
                    </h1>
                    {ConditionalForm()}
                    <div className="flex">
                         {formIndex !== 0 && (
                              <button
                                   onClick={() => setFormIndex(formIndex - 1)}
                                   className="btn btn-warning mr-5"
                              >
                                   Previous
                              </button>
                         )}
                         {formIndex !== 2 && (
                              <button
                                   onClick={() => setFormIndex(formIndex + 1)}
                                   className="btn btn-info ml-5"
                                   disabled={disableNext}
                              >
                                   Next
                              </button>
                         )}
                         {formIndex === 2 && (
                              <button
                                   onClick={handleSubmit}
                                   className="btn btn-success ml-5"
                                   disabled={disableNext}
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
