'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../utils/Navbar';
import { createPDF } from '../../../utils/Functions';

const Page = ({ params }) => {
     const [formIndex, setFormIndex] = React.useState(0);
     const [formStructure, setFormStructure] = React.useState({});
     const [formHeaders, setFormHeaders] = React.useState([]);
     const [formData, setFormData] = React.useState({});
     const [disableNext, setDisableNext] = React.useState(true);
     const [submitted, setSubmitted] = React.useState(false);
     const [predictionResults, setPredictionResults] = React.useState(null);

     useEffect(() => {
          if (formHeaders.length > 0 && formHeaders[formIndex]) {
               const keysForPage = Object.keys(
                    formStructure[formHeaders[formIndex]],
               );

               let requiredFieldsPresent = false;

               for (const key of keysForPage) {
                    if (formData[key] === '') {
                         requiredFieldsPresent = true;
                         break;
                    }
               }

               setDisableNext(requiredFieldsPresent);
          }
     }, [formData, formIndex, formStructure, formHeaders]);

     const handleSubmit = async () => {
          try {
               const res = await axios.post(
                    `https://nasahunchapi.onrender.com/${params.disease}`,
                    formData,
               );
               const { prediction, probability } = res.data;
               setPredictionResults({ prediction, probability });
               setSubmitted(true);
          } catch (error) {
               console.error('Error fetching prediction:', error);
          }
     };

     const handleReset = () => {
          setPredictionResults(null);
          setFormIndex(0);
          const resetData = Object.keys(formData).reduce((acc, key) => {
               acc[key] = '';
               return acc;
          }, {});

          setFormData(resetData);
     };

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await axios.get(
                         `https://nasahunchapi.onrender.com/get_features?disease=${params.disease}`,
                    );
                    const { features, form } = response.data;

                    // Initialize form data, structure, and headers
                    const newFormData = {};
                    for (const element of features) {
                         newFormData[element] = '';
                    }

                    setFormData(newFormData);
                    setFormStructure(form);
                    setFormHeaders(Object.keys(form));
               } catch (error) {
                    console.error('Error fetching data:', error);
               }
          };

          fetchData();
     }, []);

     return (
          <div
               className="h-screen w-screen flex flex-col items-center"
               data-theme="corporate"
          >
               <Navbar />
               <div className="flex flex-col items-center justify-center h-screen w-screen">
                    {submitted ? (
                         <div>
                              <h1 className="text-6xl">Prediction Result</h1>
                              {predictionResults === null}
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
                                                  predictionResults.probability *
                                                       100,
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
                                                       createPDF(
                                                            'Cardiovascular Page',
                                                            formData,
                                                            predictionResults.prediction,
                                                            predictionResults.probability,
                                                       );
                                                  }}
                                             >
                                                  Save as PDF
                                             </button>
                                             <a
                                                  href="/"
                                                  className="btn btn-info"
                                             >
                                                  Go To Home
                                             </a>
                                        </div>
                                   </div>
                              )}
                         </div>
                    ) : (
                         <div className="p-5 m-5 card card-bordered shadow-2xl mt-10">
                              <div className="mb-4">
                                   <p>
                                        Page {formIndex + 1} of{' '}
                                        {formHeaders.length}
                                   </p>
                              </div>
                              <Form
                                   formStructure={formStructure}
                                   formHeaders={formHeaders}
                                   formIndex={formIndex}
                                   formData={formData}
                                   setFormData={setFormData}
                              />
                              <div className="flex flex-row justify-between">
                                   <button
                                        onClick={() => {
                                             if (formIndex > 0) {
                                                  setFormIndex(formIndex - 1);
                                                  console.log(formData);
                                             }
                                             console.log(formData);
                                        }}
                                        className="btn btn-warning mt-5 mb-5"
                                        disabled={formIndex === 0}
                                   >
                                        <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor"
                                             className="w-6 h-6"
                                        >
                                             <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
                                             />
                                        </svg>
                                   </button>
                                   {formIndex === formHeaders.length - 1 ? (
                                        <button
                                             onClick={handleSubmit}
                                             className="btn btn-success mt-5 mb-5"
                                             disabled={disableNext}
                                        >
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth={1.5}
                                                  stroke="currentColor"
                                                  className="w-6 h-6"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                                  />
                                             </svg>
                                        </button>
                                   ) : (
                                        <button
                                             onClick={() => {
                                                  setFormIndex(formIndex + 1);
                                                  console.log(formData);
                                             }}
                                             className="btn btn-info mt-5 mb-5"
                                             disabled={disableNext}
                                        >
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth={1.5}
                                                  stroke="currentColor"
                                                  className="w-6 h-6"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                                                  />
                                             </svg>
                                        </button>
                                   )}
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
};

const Form = ({
     formStructure,
     formHeaders,
     formIndex,
     formData,
     setFormData,
}) => {
     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(() => ({
               ...formData,
               [name]: value,
          }));
     };

     if (formHeaders.length === 0) {
          return <div>Loading...</div>;
     } else {
          return (
               <div className="max-w-lg mx-auto" key={formIndex}>
                    <h1 className="text-2xl font-semibold mb-4">
                         {formHeaders[formIndex]}
                    </h1>
                    {Object.entries(formStructure[formHeaders[formIndex]]).map(
                         ([key, value]) => {
                              return (
                                   <div key={key} className="my-3">
                                        {value.type === 'numerical' ? (
                                             <div>
                                                  <label
                                                       htmlFor={key}
                                                       className="label-text"
                                                  >
                                                       {value.title}
                                                  </label>
                                                  <input
                                                       type="number"
                                                       id={key}
                                                       name={key}
                                                       value={formData[key]}
                                                       onChange={handleChange}
                                                       placeholder={`Enter ${value.title}`}
                                                       className="input input-bordered w-full"
                                                  />
                                             </div>
                                        ) : null}
                                        {value.type === 'categorical' ? (
                                             <div>
                                                  <label
                                                       htmlFor={key}
                                                       className="label-text"
                                                  >
                                                       {value.title}
                                                  </label>
                                                  <select
                                                       id={key}
                                                       name={key}
                                                       value={formData[key]}
                                                       onChange={handleChange}
                                                       className="select select-bordered w-full"
                                                  >
                                                       <option
                                                            selected
                                                            value=""
                                                       >
                                                            Please select{' '}
                                                            {value.title}
                                                       </option>
                                                       {Object.entries(
                                                            value.options,
                                                       ).map(
                                                            ([
                                                                 optionname,
                                                                 optionvalue,
                                                            ]) => {
                                                                 return (
                                                                      <option
                                                                           value={
                                                                                optionvalue
                                                                           }
                                                                           key={
                                                                                optionname
                                                                           }
                                                                      >
                                                                           {
                                                                                optionname
                                                                           }
                                                                      </option>
                                                                 );
                                                            },
                                                       )}
                                                  </select>
                                             </div>
                                        ) : null}
                                   </div>
                              );
                         },
                    )}
               </div>
          );
     }
};

export default Page;
