'use client';

import React, { useState, useEffect } from 'react';
import BasicsForm from './BasicsForm';
import EKGForm from './EKGForm';
import BloodWork from './BloodWorkForm';
import Loader from '../../utils/Loading';
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
     const [predictionResults, setPredictionResults] = useState(null);

     const featuresPerPage = {
          0: ['sex', 'age', 'cp', 'exang'],
          1: ['trestbps', 'chol', 'fbs'],
          2: ['thalach', 'restecg', 'oldpeak', 'slope', 'ca', 'thal'],
     };

     useEffect(() => {
          if (formIndex === 3) return;
          const features = featuresPerPage[formIndex];
          let disable = false;
          for (let i = 0; i < features.length; i++) {
               if (formData[features[i]] === '') {
                    disable = true;
                    break;
               }
          }
          setDisableNext(disable);
     }, [formData, formIndex]);

     const handleSubmit = async () => {
          try {
               const res = await axios.post(
                    'https://nasahunchapi.onrender.com/hdd',
                    formData,
               );
               const { prediction, probability } = res.data;
               setPredictionResults({ prediction, probability });
               setFormIndex(formIndex + 1);
          } catch (error) {
               console.error('Error fetching prediction:', error);
          }
     };

     const Results = () => {
          return (
               <div>
                    <h1 className="text-6xl">Prediction Result</h1>
                    {predictionResults === null && <Loader />}
                    {predictionResults && (
                         <div>
                              <p className="text-2xl">
                                   Prediction:{' '}
                                   {predictionResults.prediction === 1
                                        ? 'Positive'
                                        : 'Negative'}
                              </p>
                              <p className="text-2xl pb-5">
                                   Confidence:{' '}
                                   {Math.round(
                                        predictionResults.probability * 100,
                                   )}
                                   %
                              </p>
                              <div className="flex flex-row justify-between">
                                   <button
                                        className="btn btn-warning"
                                        onClick={handleReset}
                                   >
                                        Reset Form
                                   </button>
                                   <button
                                        className="btn btn-success ml-5"
                                        onClick={() => {
                                             // TODO: Save the report as a PDF
                                        }}
                                   >
                                        Save as Report
                                   </button>
                                   <a href="/" className="btn btn-info">
                                        Go To Home
                                   </a>
                              </div>
                         </div>
                    )}
               </div>
          );
     };

     const handleReset = () => {
          setPredictionResults(null);
          setFormIndex(0);
          setFormData({
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
     };

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
               case 3:
                    return Results();
               default:
                    return (
                         <BasicsForm
                              formData={formData}
                              setFormData={setFormData}
                         />
                    );
          }
     };

     return (
          <div
               className="min-h-screen flex items-center justify-center"
               data-theme="corporate"
          >
               <div className="m-5 card card-bordered shadow-2xl">
                    <div className="card-body">
                         <h1 className="text-2xl font-semibold mb-4">
                              Cardiovascular Disease Risk Calculator
                         </h1>
                         {ConditionalForm()}
                         <div className="flex flex-row justify-between">
                              {formIndex !== 0 && formIndex < 3 && (
                                   <button
                                        onClick={() =>
                                             setFormIndex(formIndex - 1)
                                        }
                                        className="btn btn-warning"
                                   >
                                        Previous
                                   </button>
                              )}
                              {formIndex < 2 && (
                                   <button
                                        onClick={() =>
                                             setFormIndex(formIndex + 1)
                                        }
                                        className="btn btn-info"
                                        disabled={disableNext}
                                   >
                                        Next
                                   </button>
                              )}
                              {formIndex === 2 && (
                                   <button
                                        onClick={handleSubmit}
                                        className="btn btn-success"
                                        disabled={disableNext}
                                   >
                                        Submit
                                   </button>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default BloodWorkPage;
