'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDocs, collection, orderBy, query, limit, getCountFromServer, where, Timestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Image from 'next/image';
import { DISEASES } from '../../utils/constants'

import { generateMyDataPDF } from '../../utils/pdfgen';

const MyData = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [diseases, setDiseases] = useState(DISEASES);
  const [entriesByDisease, setEntriesByDisease] = useState(null);
  const [entriesByTimeFrame, setEntriesByTimeFrame] = useState({
    day: 0,
    week: 0,
    month: 0,
    year: 0,
    all: 0
  });


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        getEntriesByDisease(user);
        getEntriesByTimeFrame(user);
        fetchMyData(user);
      } else {
        // User is signed out
        router.push('/auth/signin');
      }
    });
  }, []);

  const fetchMyData = async (user) => {
    const collectionRef = collection(firestore, "users", user.uid, "results");
    const q = query(collectionRef, orderBy("timestamp", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push({ id: doc.id, data: doc.data() });
    });
    setData(newData);
  }

  const EKGDataCard = () => {
    const handleCardClick = () => {
      router.push('/mydata/ekgdata');
    };
  
    return (
      <div className="m-3 cursor-pointer" onClick={handleCardClick}>
        <div className="card card-bordered w-80 bg-base-100 hover:shadow-2xl hover:opacity-60">
          <div className="card-body items-center text-center">
            <p className="text-lg font-bold">
              Click here for EKG Data
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getEntriesByDisease = async (user) => {
    const collectionRef = collection(firestore, "users", user.uid, "results");

    for (let i = 0; i < diseases.length; i++) {
      const q = query(collectionRef, where("disease", "==", diseases[i]));
      const querySnapshot = await getCountFromServer(q);
      setEntriesByDisease((prev) => ({
        ...prev,
        [diseases[i]]: querySnapshot.data().count
      }));
    }
  }

  const getEntriesByTimeFrame = async (user) => {
    const collectionRef = collection(firestore, "users", user.uid, "results");
    const qtoday = query(collectionRef, where("timestamp", ">=", Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)))));
    const querySnapshotToday = await getCountFromServer(qtoday);
    setEntriesByTimeFrame((prev) => ({
      ...prev,
      day: querySnapshotToday.data().count
    }));

    const qweek = query(collectionRef, where("timestamp", ">=", Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 7)))));
    const querySnapshotWeek = await getCountFromServer(qweek);
    setEntriesByTimeFrame((prev) => ({
      ...prev,
      week: querySnapshotWeek.data().count
    }));

    const qmonth = query(collectionRef, where("timestamp", ">=", Timestamp.fromDate(new Date(new Date().setMonth(new Date().getMonth() - 1)))));
    const querySnapshotMonth = await getCountFromServer(qmonth);
    setEntriesByTimeFrame((prev) => ({
      ...prev,
      month: querySnapshotMonth.data().count
    }));

    const qyear = query(collectionRef, where("timestamp", ">=", Timestamp.fromDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))));
    const querySnapshotYear = await getCountFromServer(qyear);
    setEntriesByTimeFrame((prev) => ({
      ...prev,
      year: querySnapshotYear.data().count
    }));

    const qall = query(collectionRef);
    const querySnapshotAll = await getCountFromServer(qall);
    setEntriesByTimeFrame((prev) => ({
      ...prev,
      all: querySnapshotAll.data().count
    }));
  }

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
              onClick={() => handleCardClick(disease)}
            >
              <div className="card card-bordered w-80 bg-base-100 hover:shadow-2xl hover:opacity-60">
                <figure className="px-10 pt-10">
                  <Image
                    src={`/img/${disease}.png`}
                    alt={disease}
                    width={500}
                    height={500}
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <p className="text-lg font-bold">
                    Click here for more information about {disease}
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
            <button onClick={() => { generateMyDataPDF(data) }} className="flex flex-row justify-center items-center bg-green-500 hover:bg-green-700 text-white text-xl font-bold py-2 px-4 rounded">
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
              <h2 className="text-xl font-bold mb-4">Entries by Disease</h2>
              {entriesByDisease && diseases.map((key, index) => (
                <div key={index} className="flex justify-between items-center mb-2 border-b py-2">
                  <span>{key}</span>
                  <span>{entriesByDisease[key]}</span>
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
                  {
                    Object.keys(entriesByTimeFrame).map((key, index) => (
                      <tr key={index} className="">
                        <th className="border px-4 py-2">{key}</th>
                        <td className="border px-4 py-2">{entriesByTimeFrame[key]}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card card-bordered my-5 rounded outline-black">
          <div className="overflow-x-auto w-full ">
            <h2 className="text-xl font-bold m-4">Last Five Entries</h2>
            <table className="table">
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
                  <tr key={index} className="hover:bg-gray-200" onClick={() => { router.push('/mydata/diagnosis/' + item.id) }}>
                    <th className="font-bold border px-4 py-2">{item.data.disease}</th>
                    <td className="border px-4 py-2">{item.data.prediction.prediction}</td>
                    <td className="border px-4 py-2">{(item.data.prediction.probability * 100).toFixed(4)}%</td>
                    <td className="border px-4 py-2">{new Date(item.data.timestamp.seconds * 1000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Explore by Disease</h2>
          <DiseaseCards />
          <EKGDataCard />
        </div>
      </div>
    </div>
  );

};

export default MyData;

