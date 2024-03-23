'use client';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios'; // Reintroduced axios library
import godirect from '@vernier/godirect';
import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [diseases, setDiseases] = useState(null);
  const [ekgData, setEKGData] = useState(null);
  const [error, setError] = useState(null);

  const connectToEKG = async () => {
    try {
      console.log('Opening device list chooser...');
      const ekgDevice = await godirect.selectDevice(); // Use godirect to select device

      console.log('Selected EKG device:', ekgDevice);

      if (!ekgDevice || !ekgDevice.connect) {
        setError('Failed to connect to the EKG device.');
        return;
      }

      console.log('Connecting to EKG device...');
      await ekgDevice.connect();
      console.log('Connected to EKG sensor:', ekgDevice);

      console.log('Starting EKG measurements...');
      const measurement = await ekgDevice.startMeasurements();

      measurement.subscribe(data => {
        console.log('EKG measurement:', data);
        setEKGData(data); // Update state with EKG data
      });
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while connecting to the EKG device.');
    }
  };

  const handleButtonClick = () => {
    connectToEKG();
  };

  useEffect(() => {
    axios.get('/api/diseases') // Fetch disease data from API endpoint
      .then(response => {
        setDiseases(response.data.diseases);
      })
      .catch(error => {
        console.error('Error fetching disease data:', error);
        setError('An error occurred while fetching disease data.');
      });
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
              href={`/form/${disease.value}`}
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
                  </h2>
                  <p className="text-sm">
                    {disease.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
      <button onClick={handleButtonClick} className="btn btn-primary">Get Data From Vernier EKG</button>
      {error && (
        <div className="mt-5">
          <h3 className="text-xl font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      {ekgData && !error && (
        <div className="mt-5">
          <h3 className="text-xl font-bold">Received EKG Data:</h3>
          <p>{JSON.stringify(ekgData)}</p>
        </div>
      )}
      <DiseaseCards />
    </div>
  );
};

export default HomePage;
