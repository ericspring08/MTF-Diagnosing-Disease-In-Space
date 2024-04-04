// EKGDataPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router'; 
import { firestore } from '../../../utils/firebase';

const EKGDataPage = () => {
  const [ekgData, setEKGData] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('User is not signed in');
          redirectToLogin();
          return;
        }
        console.log('User is signed in');
        
        const ekgDataCollection = collection(firestore, 'users', user.uid, 'ekgData');
        const q = query(ekgDataCollection, orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        setEKGData(data);
        console.log('EKG data:', data)
      } catch (error) {
        console.error('Error fetching EKG data:', error);
      }
    };

    fetchData();
  }, []);

  const redirectToLogin = () => {
    router.push('/login'); // Redirect to login page
  };

  if (ekgData === null) {
    return (
      <div className="h-screen w-screen flex justify-center items-center" data-theme="corporate">
        <span className="loading loading-lg loading-dots"></span>
      </div>
    );
  }

  if (ekgData.length === 0) {
    return (
      <div className="h-screen w-screen flex justify-center items-center" data-theme="corporate">
        <p className="text-2xl font-bold">No EKG Data</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen" data-theme="corporate">
      <table>
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
