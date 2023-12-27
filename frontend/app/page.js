'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../utils/Navbar';

const HomePage = () => {
     const [diseases, setDiseases] = React.useState(null);

     useEffect(() => {
          let promise = axios.get('https://nasahunchapi.onrender.com/diseases');
          promise.then((response) => {
               setDiseases(response.data.diseases);
          });
     }, []);

     const DiseaseButtons = () => {
          if (diseases === null) return null;
          else {
               return (
                    <div className="flex flex-wrap justify-center items-center">
                         {diseases.map((disease) => (
                              <Link
                                   legacyBehavior
                                   href={`/form/${disease}`}
                                   key={disease}
                              >
                                   <button className="btn btn-warning px-6 py-2">
                                        {disease}
                                   </button>
                              </Link>
                         ))}
                    </div>
               );
          }
     };

     return (
          <div data-theme="corporate">
               <Navbar />
               <DiseaseButtons />
          </div>
     );
};

export default HomePage;
