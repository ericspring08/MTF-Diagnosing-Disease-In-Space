"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { auth, firestore } from '../../../../utils/firebase';
import { generateDiagnosisPDF } from '../../../../utils/pdfgen';

const DiagnosisPage = ({ params }) => {
  const { id } = params;
  const [data, setData] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(firestore, "users", user.uid, "results", id);

          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting documents: ", error);
        }
      } else {
        router.push('/auth/signin');
      }
    });
  }, []);

  if (!data) {
    return (
      <div className="h-screen w-screen" data-theme="corporate">
        <h1 className="text-xl font-bold px-6 pt-6 pb-2">Diagnosis {id}</h1>
        <span className="loading loading-lg loading-dots"></span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen" data-theme="corporate">
      <div className="flex flex-row justify-between items-center px-6 pt-6 flex-wrap">
        <h1 className="text-3xl font-bold">{data.diseaseName} Diagnosis {id}</h1>
        <div className="flex justify-center">
          <button onClick={() => { generateDiagnosisPDF(data.diseaseName, data.formData, data.prediction.prediction, data.prediction.probability) }} className="flex flex-row justify-center items-center bg-green-500 hover:bg-green-700 text-white text-xl font-bold py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
      <div className="flex flex-row mx-2 flex-wrap">
        <div className="sm:basis-1/4 w-full p-4">
          <div className="flex flex-row items-center justify-center stats rounded card-bordered">
            <div className="stat w-min">
              <div className="stat-title">Prediction</div>
              {
                data.prediction.prediction === 0 ? (
                  <div className="stat-value
              text-red-500">Negative</div>
                ) : (
                  <div className="stat-value
              text-green-500">Positive</div>
                )
              }
              <div className="stat-desc">Prediction of the diagnosis</div>
            </div>
          </div>
        </div>
        <div className="sm:basis-1/4 w-full p-4">
          <div className="flex flex-row items-center justify-center stats rounded card-bordered">
            <div className="stat w-min">
              <div className="stat-title">Confidence</div>
              <div className="stat-value">{(data.prediction.probability * 100).toFixed(4)}%</div>
              <div className="stat-desc">Confidence of the prediction</div>
            </div>
          </div>
        </div>
        <div className="sm:basis-1/4 w-full p-4">
          <div className="flex flex-row items-center justify-center stats rounded card-bordered">
            <div className="stat w-min">
              <div className="stat-title">Date</div>
              <div className="stat-value">{new Date(data.timestamp.seconds * 1000).toLocaleString().split(', ')[0]}</div>
              <div className="stat-desc">Date of the diagnosis</div>
            </div>
          </div>
        </div>
        <div className="sm:basis-1/4 w-full p-4">
          <div className="flex flex-row items-center justify-center stats rounded card-bordered">
            <div className="stat w-min">
              <div className="stat-title">Time</div>
              <div className="stat-value">{new Date(data.timestamp.seconds * 1000).toLocaleString().split(', ')[1]}</div>
              <div className="stat-desc">Time of the diagnosis</div>
            </div>
          </div>
        </div>

      </div>
      <div className="card card-bordered rounded mx-6 my-2 overflow-x-auto">
        <div className="text-xl font-bold p-3">Form Input</div>
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Attribute Name</th>
              <th>Attribute Value</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.entries(data.formData).map(([key, value], index) => (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DiagnosisPage;
