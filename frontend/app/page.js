// Import necessary dependencies
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { DISEASE_COLOR_MAP } from '@/utils/constants';

const HomePage = () => {
  const [diseases, setDiseases] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/diseases');
        setDiseases(response.data);
      } catch (error) {
        console.error('Error fetching disease data:', error);
        setError('An error occurred while fetching disease data.');
      }
    };

    fetchData();
  }, []);

  const DiseaseCards = () => {
    if (diseases === null)
      return <span className="loading loading-dots loading-lg"></span>;
    else {
      return (
        <div className="flex flex-wrap justify-center items-stretch">
          {diseases.map((disease) => (
            <Link
              className="flex flex-wrap justify-center items-stretch m-3"
              href={disease.path}
              key={disease.value}
            >
              <div className="card card-bordered w-80 bg-base-100 hover:shadow-2xl hover:opacity-60">
                <figure className="px-10 pt-10">
                  <Image
                    src={`/img/${disease.value}.png`}
                    alt={disease}
                    width={500}
                    height={500}
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">
                    {disease.label}
                    <span className={`badge ml-2 bg-${DISEASE_COLOR_MAP[disease.type]}`}>
                      {disease.type}
                    </span>
                  </h2>
                  <p className="text-sm">
                    {disease.description}
                  </p>
                </div>
              </div>
            </Link>
          ))
          }
        </div >
      );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center" data-theme="corporate">
      <h1 className="text-5xl text-center font-bold mt-10 mb-5" data-theme="corporate">
        Welcome to the Disease Diagnosis System
      </h1>
      <h2 className="text-3xl text-center mt-5 mb-10" data-theme="corporate">
        Select a disease to diagnose
      </h2>
      <DiseaseCards />
    </div>
  );
};

export default HomePage;
