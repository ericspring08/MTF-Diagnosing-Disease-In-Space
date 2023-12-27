
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

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
            <Link legacyBehavior href={`/form/${disease}`} key={disease}>
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
    <div className="h-screen flex flex-col justify-center items-center" data-theme="corporate">
      <div className="lg:text-8xl md:text-5xl sm:text-5xl text-5xl p-10 text-center">
        Smart Disease Diagnosis
      </div>
      <DiseaseButtons />
    </div>
  );
};

export default HomePage;
