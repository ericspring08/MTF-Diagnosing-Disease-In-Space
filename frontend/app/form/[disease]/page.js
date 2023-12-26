'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { headers } from '@/next.config';

const Page = ({ params }) => {
     const [formIndex, setFormIndex] = React.useState(0);
     const [formStructure, setFormStructure] = React.useState({});
     const [formHeaders, setFormHeaders] = React.useState([]);
     const [formData, setFormData] = React.useState({});

     useEffect(() => {
          // fill formdata with blank values
          let promise = axios.get(
               `https://nasahunchapi.onrender.com/get_features?disease=${params.disease}`,
          );
          promise.then((response) => {
               for (const element of response.data.features)
                    setFormData(() => ({
                         ...formData,
                         [element]: '',
                    }));
               setFormStructure(response.data.form);
               setFormHeaders(Object.keys(response.data.form));
          });
     }, []);

     return (
          <div className="h-screen w-screen" data-theme="corporate">
               <Form
                    formStructure={formStructure}
                    formHeaders={formHeaders}
                    formIndex={formIndex}
                    formData={formData}
                    setFormData={setFormData}
               />
               <button
                    onClick={() => {
                         setFormIndex(formIndex + 1);
                         console.log(formData);
                    }}
               >
                    Next
               </button>
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
