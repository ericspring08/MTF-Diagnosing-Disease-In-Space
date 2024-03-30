'use client';
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Image from 'next/image';
import axios from 'axios';
import godirect from '@vernier/godirect';
import { detectPeaks, calculateRRIntervals, findMaxima, findMinima, measureSegmentSlope } from '../../utils/ekgfunctions'; // Import functions from ekgfunctions.js
import Link from 'next/link'; // Import Link component

// Define the HomePage component
const HomePage = () => {
  // State variables
  const [error, setError] = useState(null);
  const [numSensors, setNumSensors] = useState(null);
  let ekgChart; // Initialize EKG chart
  const [showEkgDescription, setShowEkgDescription] = useState(false);
  const [ekgDataValues, setEkgDataValues] = useState(null); // State variable to store calculated EKG data values

  // Function to connect to EKG device
  const connectToEKG = async () => {
    try {
      const ekgDevice = await godirect.selectDevice();

      if (!ekgDevice) {
        setError('Failed to select the EKG device.');
        return;
      }

      console.log('Available sensors:', ekgDevice.availableSensors);
      setNumSensors(ekgDevice.availableSensors.length);

      const enabledSensors = ekgDevice.sensors.filter(s => s.enabled);

      const handleValueChanged = (sensor) => {
        if (ekgChart.data.datasets[0].data.length < 300) {
          console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`);

          ekgChart.data.labels.push('');
          ekgChart.data.datasets[0].data.push(sensor.value);
          ekgChart.update();

          // Calculate EKG data values using imported functions
          // Define the threshold for peak detection
          const threshold = 0.275; // You can adjust this value as needed
          const samplingRate = 1;
          const start = 0;
          const end = 1000;
          const peaks = detectPeaks(ekgChart.data.datasets[0].data, threshold);
          const rrIntervals = calculateRRIntervals(peaks, samplingRate); // You need to define the 'samplingRate' variable
          const maxima = findMaxima(ekgChart.data.datasets[0].data);
          const minima = findMinima(ekgChart.data.datasets[0].data);
          const segmentLength = measureSegmentSlope(ekgChart.data.datasets[0].data, peaks); // You need to define the 'start', 'end', and 'samplingRate' variables

          // Update state with calculated EKG data values
          setEkgDataValues({
            peaks,
            rrIntervals,
            maxima,
            minima,
            segmentLength
          });
        } else {
          console.log('Stopped logging after 100 data points.');
          enabledSensors.forEach(sensor => sensor.off('value-changed', handleValueChanged));
        }
      };

      enabledSensors.forEach(sensor => sensor.on('value-changed', handleValueChanged));
      

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
              display: false
            }
          }
        }
      });

      setShowEkgDescription(true);

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

  const calculateAverage = (values) => {
    // Check if values is an array and not empty
    if (!Array.isArray(values) || values.length === 0) return 0;
  
    // Check if all values are numbers
    if (!values.every(value => typeof value === 'number')) return 0;
  
    // Perform the average calculation
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return sum / values.length;
  }
  
  // Render the HomePage component
  return (
    <div className="h-screen w-screen flex flex-col items-center" data-theme="corporate">
      <h1 className="text-5xl text-center font-bold mt-10 mb-5" data-theme="corporate">
        Click Below to Get Data from Your Vernier EKG Machine
      </h1>
      <div className="flex flex-col justify-center">
        {/* EKG Button Card */}
        <div className="card card-bordered w-80 bg-base-100 hover:shadow-2xl hover:opacity-60 m-3" onClick={connectToEKG}>
          <figure className="px-10 pt-10">
            <Image
              src={`/img/ekg_button.png`}
              alt="EKG Button"
              width={500}
              height={500}
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Get Data From Vernier EKG</h2>
            <p className="text-sm">Click to initiate data collection</p>
          </div>
        </div>
        {/* EKG Description */}
        {showEkgDescription && (
          <div className="card card-bordered bg-base-100 hover:shadow-2xl hover:opacity-60 m-3">
            <div className="ekg-info p-6">
              <h3>Understanding Electrocardiogram (EKG or ECG)</h3>
              <p>An Electrocardiogram (EKG or ECG) is a diagnostic test that measures and records the electrical activity of your heart. It's a non-invasive procedure that helps doctors assess the heart's health and detect any abnormalities in its rhythm or structure.</p>
            </div>
            <hr className="my-4" />
            <div className="ekg-info p-6">
              <h4>Components of an EKG</h4>
              <ul>
                <li><strong>P Wave:</strong> Represents atrial depolarization, indicating the contraction of the atria.</li>
                <li><strong>QRS Complex:</strong> Indicates ventricular depolarization, marking the contraction of the ventricles.</li>
                <li><strong>T Wave:</strong> Reflects ventricular repolarization, signifying the relaxation phase of the ventricles.</li>
              </ul>
            </div>
            <hr className="my-4" />
            <div className="ekg-info p-6">
              <h4>Common Abnormalities Detected by EKG</h4>
              <ul>
                <li><strong>Sinus Bradycardia:</strong> Slow heart rate, usually below 60 beats per minute.</li>
                <li><strong>Atrial Fibrillation:</strong> Irregular and rapid heartbeat originating from the atria.</li>
                <li><strong>Ventricular Tachycardia:</strong> Rapid heart rate arising from abnormal electrical signals in the ventricles.</li>
                <li><strong>Ventricular Fibrillation:</strong> Chaotic, irregular heartbeat originating from the ventricles, often leading to cardiac arrest.</li>
                <li><strong>ST Segment Elevation/Depression:</strong> Indicates potential myocardial infarction or ischemia (heart attack).</li>
              </ul>
            </div>
            <hr className="my-4" />
            <div className="ekg-info p-6">
              <h4>Interpretation Guidelines</h4>
              <p>Interpreting an EKG requires understanding the normal patterns of electrical activity in the heart and recognizing deviations from these patterns. It's essential to consider the clinical context, patient history, and symptoms when analyzing EKG results.</p>
            </div>
            <hr className="my-4" />
            <div className="ekg-info p-6">
              <h4>Conclusion</h4>
              <p>EKG interpretation is a crucial skill for healthcare professionals, enabling them to diagnose and manage various cardiac conditions. While the EKG provides valuable information, it's essential to integrate findings with other clinical data for accurate diagnosis and treatment planning.</p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div role="alert" className="alert alert-error rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="font-bold">Error connecting to Vernier EKG</h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      )}
      <canvas id="ekgChart" width="800" height="400"></canvas>
  
      {/* Table to display calculated EKG data values */}
      {ekgDataValues ? (
        <div className="mt-5">
          <h2 className="text-2xl font-bold mb-3">Calculated EKG Data Values</h2>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Peak</th>
                <th>RR Interval</th>
                <th>Maxima</th>
                <th>Minima</th>
                <th>ST Segment Slope</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>{ekgDataValues.peaks.slice(0, 5).join(', ')}</td>
              <td>{calculateAverage(ekgDataValues.rrIntervals).toFixed(2)}</td>
              <td>{ekgDataValues.maxima !== undefined ? ekgDataValues.maxima : '-'}</td>
              <td>{ekgDataValues.minima !== undefined ? ekgDataValues.minima : '-'}</td>
              <td>{(calculateAverage(ekgDataValues.segmentLength) * 100).toFixed(4)}</td>
          </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5">Loading...</div>
      )}
    </div>
  );  
};

export default HomePage;
