// EKGDataPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { firestore, auth } from '../../../utils/firebase'; // Import auth object

const EKGDataPage = () => {
  const [ekgData, setEKGData] = useState([]);

  useEffect(() => {
    // Query the Firestore collection for the latest five documents based on the timestamp field
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('User is not signed in');
      } else {
        console.log('User is signed in');
        const ekgDataCollection = collection(firestore, 'users', user.uid, 'ekgData');
        const q = query(ekgDataCollection, orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        console.log('Fetched EKG data:', data); // Log fetched data
        setEKGData(data);
      }
    });
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
            <th className="border border-blue-700 px-4 py-2">ST Slope</th>
            <th className="border border-blue-700 px-4 py-2">Normalcy</th>
          </tr>
        </thead>
        <tbody>
          {ekgData.map((data, index) => (
            <tr key={index} className="bg-blue-100">
              <td className="border border-blue-700 px-4 py-2 text-black">{data.peaks.length > 0 ? data.peaks.join(', ') : '-'}</td>
              <td className="border border-blue-700 px-4 py-2 text-black">{data.rrIntervals.length > 0 ? data.rrIntervals.join(', ') : '-'}</td>
              <td className="border border-blue-700 px-4 py-2 text-black">{data.maxima || '-'}</td>
              <td className="border border-blue-700 px-4 py-2 text-black">{data.minima || '-'}</td>
              <td className="border border-blue-700 px-4 py-2 text-black">{data.segmentLength || '-'}</td>
              <td className="border border-blue-700 px-4 py-2 text-black">{data.normalcy || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default EKGDataPage;
