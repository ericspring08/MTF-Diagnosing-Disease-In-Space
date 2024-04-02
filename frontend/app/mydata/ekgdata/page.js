// EKGDataPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase'; 

const EKGDataPage = () => {
  const [ekgData, setEKGData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query the Firestore collection for the latest five documents based on the timestamp field
        const ekgDataCollection = collection(firestore, 'ekgData');
        const q = query(ekgDataCollection, orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        setEKGData(data);
      } catch (error) {
        console.error('Error fetching EKG data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
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
              <td className="border border-blue-700 px-4 py-2">{data.peaks.length > 0 ? data.peaks.join(', ') : '-'}</td>
              <td className="border border-blue-700 px-4 py-2">{data.rrIntervals.length > 0 ? data.rrIntervals.join(', ') : '-'}</td>
              <td className="border border-blue-700 px-4 py-2">{data.maxima || '-'}</td>
              <td className="border border-blue-700 px-4 py-2">{data.minima || '-'}</td>
              <td className="border border-blue-700 px-4 py-2">{data.segmentLength || '-'}</td>
              <td className="border border-blue-700 px-4 py-2">{data.normalcy || '-'}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EKGDataPage;
