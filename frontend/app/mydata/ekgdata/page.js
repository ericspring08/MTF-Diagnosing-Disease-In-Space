// EKGDataPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore, auth } from '@/utils/firebase'; // Import auth from Firebase
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import Chart from 'chart.js/auto'; // Import Chart.js

const EKGDataPage = () => {
  const [ekgData, setEKGData] = useState([]);
  const [sensorDataPoints, setSensorDataPoints] = useState([]);

  useEffect(() => {
    const fetchEKGData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.log('User is not signed in');
        } else {
          const ekgDataCollection = collection(firestore, 'users', user.uid, 'ekgData');
          const q = query(ekgDataCollection, orderBy('createdAt', 'desc'), limit(5)); // Limit to 5 most recent entries
          const snapshot = await getDocs(q);
          const ekgDataArray = [];
          snapshot.forEach((doc) => {
            const data = { ...doc.data(), id: doc.id }; // Include document ID for reference
            ekgDataArray.push(data);
          });
          console.log('EKG Data Array:', ekgDataArray); // Log the fetched EKG data array
          setEKGData(ekgDataArray);
          if (ekgDataArray.length > 0) {
            const latestSensorData = ekgDataArray[0].sensorData || [];
            console.log('Latest Sensor Data:', latestSensorData); // Log the latest sensor data
            setSensorDataPoints(latestSensorData);
            renderEKGGraph(latestSensorData);
          }
        }
      });
    };

    fetchEKGData();
  }, []);

  const renderEKGGraph = (sensorDataPoints) => {
    if (sensorDataPoints.length === 0) {
      console.log('No sensor data points to render graph.');
      return;
    }

    const ctx = document.getElementById('ekgGraph');
    const ekgChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: sensorDataPoints.length }, (_, i) => i + 1),
        datasets: [{
          label: 'EKG Graph',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          data: sensorDataPoints,
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Sensor Data'
            }
          }
        }
      }
    });
  };

  return (
    <div className="h-screen-min w-screen" data-theme="corporate">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">EKG Data</h1>
      <table className="w-full table-auto border-collapse border border-blue-700">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="border border-blue-700 px-4 py-2">Peak</th>
            <th className="border border-blue-700 px-4 py-2">RR Interval</th>
            <th className="border border-blue-700 px-4 py-2">Maxima</th>
            <th className="border border-blue-700 px-4 py-2">Minima</th>
            <th className="border border-blue-700 px-4 py-2">ST Slope</th>
            <th className="border border-blue-700 px-4 py-2">Normalcy</th>
          </tr>
        </thead>
        <tbody>
          {ekgData.map((data, index) => (
            <tr key={index} className="bg-blue-100">
              <td className="border border-blue-700 px-4 py-2">{data.peaks.join(', ')}</td>
              <td className="border border-blue-700 px-4 py-2">{data.rrIntervals}</td>
              <td className="border border-blue-700 px-4 py-2">{data.maxima}</td>
              <td className="border border-blue-700 px-4 py-2">{data.minima}</td>
              <td className="border border-blue-700 px-4 py-2">{data.segmentLength * 100}</td>
              <td className="border border-blue-700 px-4 py-2">{data.normalcy}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Most Recent Entry EKG Graph */}
      <div className="mt-5">
        <h2 className="text-lg font-bold mb-2 text-blue-700">Most Recent Entry EKG Graph</h2>
        <canvas id="ekgGraph" width="800" height="400"></canvas>
      </div>
    </div>
  );
};

export default EKGDataPage;
