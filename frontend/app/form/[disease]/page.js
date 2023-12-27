'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { headers } from '@/next.config';

const Page = ({ params }) => {
     const [formIndex, setFormIndex] = React.useState(0);
     const [formStructure, setFormStructure] = React.useState({});
     const [formHeaders, setFormHeaders] = React.useState([]);
     const [formData, setFormData] = React.useState({});
     const [disableNext, setDisableNext] = React.useState(true);

     useEffect(() => {
          if (formHeaders.length > 0 && formHeaders[formIndex]) {
              const keysForPage = Object.keys(formStructure[formHeaders[formIndex]]);
      
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
      
      useEffect(() => {
          const fetchData = async () => {
              try {
                  const response = await axios.get(`https://nasahunchapi.onrender.com/get_features?disease=${params.disease}`);
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
               className="h-screen w-screen flex flex-col justify-center items-center"
               data-theme="corporate"
          >
               <div className="p-5 m-5 card card-bordered shadow-2xl">
                    <Form
                         formStructure={formStructure}
                         formHeaders={formHeaders}
                         formIndex={formIndex}
                         formData={formData}
                         setFormData={setFormData}
                    />
                    <div className="flex flex-row justify-between p-4">
                         <button
                              onClick={() => {
                                   if (formIndex > 0) {
                                        setFormIndex(formIndex - 1);
                                        console.log(formData);
                                    }
                                   console.log(formData);
                                   
                              }}
                              className="btn btn-warning px-6 py-2"
                              disabled={formIndex === 0}
                         >
                              Previous
                         </button>
                         <button
                              onClick={() => {
                                   setFormIndex(formIndex + 1);
                                   console.log(formData);
                              }}
                              className="btn btn-info px-6 py-2"
                              disabled={disableNext}
                         >
                              Next
                         </button>
                    </div>
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
                                   <div key={key}>
                                        {value.type === 'numerical' ? (
                                             <div>
                                                  <label
                                                       htmlFor={key}
                                                       className="block text-gray-700 font-semibold mb-2"
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
                                                       className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                                                  />
                                             </div>
                                        ) : null}
                                        {value.type === 'categorical' ? (
                                             <div>
                                                  <label
                                                       htmlFor={key}
                                                       className="block text-gray-700 font-semibold mb-2"
                                                  >
                                                       {value.title}
                                                  </label>
                                                  <select
                                                       id={key}
                                                       name={key}
                                                       value={formData[key]}
                                                       onChange={handleChange}
                                                       className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                                                  >
                                                       <option value="">
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
