'use client';
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js library
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import godirect from '@vernier/godirect';

const HomePage = () => {
  const [diseases, setDiseases] = useState(null);
  const [error, setError] = useState(null);
  const [numSensors, setNumSensors] = useState(null);
  const [ekgMeasurement, setEKGMeasurement] = useState(null);
  const [logCounter, setLogCounter] = useState(0); // Counter for logging sensor data

  // Initialize variables for EKG chart
  let ekgChart;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/diseases');
        setDiseases(response.data.diseases);
      } catch (error) {
        console.error('Error fetching disease data:', error);
        setError('An error occurred while fetching disease data.');
      }
    };

    fetchData();

    return () => {
      if (ekgMeasurement) {
        ekgMeasurement.unsubscribe();
      }
    };
  }, []);

  const connectToEKG = async () => {
    try {
      console.log('Opening device list chooser...');
      const ekgDevice = await godirect.selectDevice();
  
      console.log('Selected EKG device:', ekgDevice);
  
      if (!ekgDevice) {
        setError('Failed to select the EKG device.');
        return;
      }
  
      // Access device properties to display sensor availability
      console.log('Available sensors:', ekgDevice.availableSensors);
      setNumSensors(ekgDevice.availableSensors.length);
  
      // Get a filtered array of only the enabled sensor(s).
      const enabledSensors = ekgDevice.sensors.filter(s => s.enabled);
  
      // Increment log counter once per data update, not per sensor
// Increment log counter once per data update, not per sensor
const handleValueChanged = (sensor) => {
  if (ekgChart.data.datasets[0].data.length < 100) { // Check if data points are less than 100
    // Log the sensor name, new value, and units.
    console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`);
  
    // Update the EKG chart with the new data point
    ekgChart.data.labels.push('');
    ekgChart.data.datasets[0].data.push(sensor.value);
    ekgChart.update(); // Update the chart
  } else {
    // Stop logging after 100 data points
    console.log('Stopped logging after 100 data points.');
    enabledSensors.forEach(sensor => sensor.removeAllListeners()); // Remove all listeners
  }
};

      // Loop through the array of `enabledSensors` and set up value change listeners.
      enabledSensors.forEach(sensor => sensor.on('value-changed', handleValueChanged));
  
      // Set up the EKG chart
      const ctx = document.getElementById('ekgChart');
      ekgChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'EKG Data',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            data: [],
            fill: false
          }]
        },
        options: {
          scales: {
            x: {
              display: false // Hide x-axis labels
            }
          }
        }
      });
  
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'device_selection_failed') {
        setError('Failed to select the EKG device.');
      } else if (error.code === 'connection_failed') {
        setError('Failed to connect to the EKG device.');
      } else if (error.code === 'start_measurements_failed') {
        setError('Failed to start EKG measurements.');
      } else {
        setError('An error occurred while connecting to the EKG device.');
      }
    }
  };
  
  

  const handleButtonClick = () => {
    connectToEKG();
  };

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
      {numSensors && (
        <div className="mt-5">
          <h3 className="text-xl font-bold">Number of Available Sensors:</h3>
          <p>{numSensors}</p>
        </div>
      )}
      {error && (
        <div className="mt-5">
          <h3 className="text-xl font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      {/* Add the canvas element for the EKG chart */}
      <canvas id="ekgChart" width="400" height="200"></canvas>
      <DiseaseCards />
    </div>
  );
};

export default HomePage;
