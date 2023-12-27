'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const HomePage = () => {
     const [diseases, setDiseases] = React.useState(null);

     useEffect(() => {
          let promise = axios.get('/api/diseases');
          promise.then((response) => {
               setDiseases(response.data.diseases);
          });
     }, []);

     const DiseaseCards = () => {
          if (diseases === null) return null;
          else {
               return (
                    <div className="flex flex-wrap justify-center items-stretch">
                         {diseases.map((disease) => (
                              <Link
                                   className="flex flex-wrap justify-center items-stretch"
                                   href={`/form/${disease.value}`}
                                   key={disease.value}
                              >
                                   <div class="card card-bordered m-5 w-96 bg-base-100 shadow-xl hover:shadow-2xl hover:opacity-60">
                                        <figure class="px-10 pt-10">
                                             <Image
                                                  src={`/img/${disease.value}.png`}
                                                  alt={disease}
                                                  width={1000}
                                                  height={1000}
                                             />
                                        </figure>
                                        <div class="card-body items-center text-center">
                                             <h2 class="card-title">
                                                  {disease.label}
                                             </h2>
                                             <p>{disease.description}</p>
                                        </div>
                                   </div>
                              </Link>
                         ))}
                    </div>
               );
          }
     };

     return (
          <div className="h-screen w-screen" data-theme="corporate">
               <h1
                    className="text-5xl text-center font-bold mt-10 mb-5"
                    data-theme="corporate"
               >
                    Welcome to the Disease Diagnosis System
               </h1>
               <h2
                    className="text-3xl text-center mt-5 mb-10"
                    data-theme="corporate"
               >
                    Select a disease to diagnose
               </h2>
               <DiseaseCards />
          </div>
     );
};

export default HomePage;
