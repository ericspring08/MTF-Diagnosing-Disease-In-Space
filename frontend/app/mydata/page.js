'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDocs, collection, orderBy, query, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../../utils/firebase';
import axios from 'axios';
import Image from 'next/image';

import { generateMyDataPDF } from '../../utils/pdfgen';

const MyData = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [diseases, setDiseases] = useState(null);
  const [entriesByDay, setEntriesByDay] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let promise = axios.get('/api/diseases');
        promise.then((response) => {
          setDiseases(response.data.diseases);
        });
        const collectionRef = collection(firestore, "users", user.uid, "results");
        const q = query(collectionRef, orderBy("timestamp", "desc"), limit(5));

        await getDocs(q).then((querySnapshot) => {
          const newData = [];
          const entriesMap = {};
          if (querySnapshot.empty) {
            console.log('No matching documents.');
          } else {
            querySnapshot.forEach((doc) => {
              const item = doc.data();
              newData.push({ id: doc.id, data: item });
              const date = new Date(item.timestamp.seconds * 1000).toLocaleDateString();
              if (!entriesMap[date]) {
                entriesMap[date] = 0;
              }
              entriesMap[date]++;
            });
            setData(newData);
            setEntriesByDay(entriesMap);
          }
        }).catch((error) => {
          console.error("Error getting documents: ", error);
        });
      } else {
        // User is signed out
        router.push('/auth/signin');
      }
    });
  }, []);

  const DiseaseCards = () => {
    const handleCardClick = (diseaseValue) => {
      router.push(`/mydata/specdata/${diseaseValue}`);
    };
  
    if (diseases) {
      return (
        <div className="flex flex-wrap justify-center items-stretch">
          {diseases.map((disease, index) => (
            <div
              key={index}
              className="m-3 cursor-pointer"
              onClick={() => handleCardClick(disease.value)}
            >
              <div className="card card-bordered w-80 bg-base-100 hover:shadow-2xl hover:opacity-60">
                <figure className="px-10 pt-10">
                  <Image
                    src={`/img/${disease.value}.png`}
                    alt={disease.label}
                    width={500}
                    height={500}
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <p className="text-lg font-bold">
                    Click here for more information about {disease.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  
  
  
  
  
  

  return (
    <div className="flex flex-wrap justify-center h-screen w-screen" data-theme="corporate">
      <div className="w-full p-6">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">My Data</h1>
          <div className="flex justify-center">
            <button onClick={() => { generateMyDataPDF(data.data) }} className="flex flex-row justify-center items-center bg-green-500 hover:bg-green-700 text-white text-xl font-bold py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="bg-white p-4 rounded card card-bordered outline-black">
              <h2 className="text-xl font-bold mb-4">Entries by Category</h2>
              {diseases && diseases.map((category) => (
                <div key={category.value} className="flex justify-between items-center mb-2 border-b py-2">
                  <span>{category.label}</span>
                  <span>{data.filter(item => item.data.disease === category.value).length}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white p-4 card card-bordered rounded-2xl outline-black overflow-y-auto max-h-80">
              <h2 className="text-xl font-bold mb-4">Entries by Day</h2>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-gray-100">Date</th>
                    <th className="border px-4 py-2 bg-gray-100">Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(entriesByDay).map(([date, count], index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border px-4 py-2">{date}</td>
                      <td className="border px-4 py-2">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card card-bordered my-5 rounded outline-black">
          <div className="overflow-x-auto w-full ">
            <h2 className="text-xl font-bold m-4">Last Five Entries</h2>
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Disease</th>
                  <th>Prediction</th>
                  <th>Probability</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"} onClick={() => { router.push('/mydata/diagnosis/' + item.id) }}>
                    <th className="font-bold border px-4 py-2">{item.data.disease}</th>
                    <td className="border px-4 py-2">{item.data.prediction.prediction}</td>
                    <td className="border px-4 py-2">{item.data.prediction.probability}</td>
                    <td className="border px-4 py-2">{new Date(item.data.timestamp.seconds * 1000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DiseaseCards />

      </div>
    </div>
  );
};

export default MyData;

