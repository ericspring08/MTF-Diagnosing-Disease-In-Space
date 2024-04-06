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
    // Function to fetch EKG data from Firestore
    const fetchEKGData = async () => {
      onAuthStateChanged(auth, async (user) => { // Use auth here
        if (!user) {
          console.log('User is not signed in');
        } else {
          // You forgot to add the timestamp for every EKG data entry so it can't sort
          const ekgDataCollection = collection(firestore, 'users', user.uid, 'ekgData');
          const q = query(ekgDataCollection, limit(5));
          const snapshot = await getDocs(q);
          const ekgDataArray = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ekgDataArray.push(data);
          });
          console.log(ekgDataArray);
          setEKGData(ekgDataArray);
          setSensorDataPoints(ekgDataArray[0].sensorData);
        }
      });
    };

    fetchEKGData();
  }, []);

  // Function to render EKG graph using Chart.js
  const renderEKGGraph = (sensorDataPoints) => {
    const ctx = document.getElementById('ekgGraph');
    const ekgChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: sensorDataPoints.length }, (_, i) => i + 1), // Generating labels from 1 to n for x-axis
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
            <th className="border border-blue-700 px-4 py-2">Segment Length</th>
            <th className="border border-blue-700 px-4 py-2">Normalcy</th>
          </tr>
        </thead>
        <tbody>
          {ekgData.map((data, index) => (
            <tr key={index} className="bg-blue-100">
              <td className="border border-blue-700 px-4 py-2">{data.peaks}</td>
              <td className="border border-blue-700 px-4 py-2">{data.rrIntervals}</td>
              <td className="border border-blue-700 px-4 py-2">{data.maxima}</td>
              <td className="border border-blue-700 px-4 py-2">{data.minima}</td>
              <td className="border border-blue-700 px-4 py-2">{data.segmentLength}</td>
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
