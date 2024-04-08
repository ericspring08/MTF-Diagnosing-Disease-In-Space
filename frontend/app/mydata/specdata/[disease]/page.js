'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, limit, startAfter, endBefore, getCountFromServer, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/utils/firebase';
import { Chart, registerables } from 'chart.js';
import { generateMyDataPDF } from '../../../../utils/pdfgen';
import { DISEASES, DISEASE_NAMES } from '../../../../utils/constants';

const MyData = ({ params }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLimited, setDataLimited] = useState([]);
  const [firstIndex, setFirstIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [disableNext, setDisableNext] = useState(false);
  const [disablePrevious, setDisablePrevious] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        initialFetch(user);
      } else
        router.push('/auth/signin');
    })
  }, []);

  const initialFetch = async (user) => {
    // count total number of entries
    const totalEntries = await getCountFromServer(collection(firestore, 'users', user.uid, 'results'));

    if (totalEntries.data().count === 0) {
      setLoading(false);
      return;
    }

    setTotalEntries(totalEntries.data().count);

    const q = doc(firestore, 'users', user.uid)
    let data_temp = null;
    await getDoc(q).then((doc) => {
      // loop through params.disease-graphing array fild
      data_temp = doc.data();
      for (let i = 0; i < data_temp[params.disease + '-graphing'].length; i++) {
        data_temp[params.disease + '-graphing'][i].timestamp = new Date(data_temp[params.disease + '-graphing'][i].timestamp.seconds * 1000).toLocaleString();
        data_temp[params.disease + '-graphing'][i].prediction = Math.round(data_temp[params.disease + '-graphing'][i].probability);
        if (data_temp[params.disease + '-graphing'][i].prediction === 0) {
          data_temp[params.disease + '-graphing'][i].prediction = 'Negative';
        } else {
          data_temp[params.disease + '-graphing'][i].prediction = 'Positive';
        }
      }
    })
    setData(data_temp[params.disease + '-graphing']);
    if (data_temp[params.disease + '-graphing'].length < 5) {
      setDisableNext(true);
    }
    setDisablePrevious(true);
    setDataLimited(data_temp[params.disease + '-graphing'].slice(0, 5));
    setFirstIndex(0);
    setTotalEntries(data_temp[params.disease + '-graphing'].length);
    setLoading(false);
  }

  const fetchNextData = async (user) => {
    setDataLimited(data.slice(firstIndex + 5, firstIndex + 10));
    setFirstIndex(firstIndex + 5);
    if (firstIndex + 10 >= totalEntries) {
      setDisableNext(true);
    }
    setDisablePrevious(false);
  }

  const fetchPreviousData = async (user) => {
    setDataLimited(data.slice(firstIndex - 5, firstIndex));
    setFirstIndex(firstIndex - 5);
    if (firstIndex - 5 <= 0) {
      setDisablePrevious(true);
    }
    setDisableNext(false);
  }

  useEffect(() => {
    if (data.length === 0) return;
    Chart.register(...registerables);

    const ctx = document.getElementById('myChart');

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        // on timestamps only show the date
        labels: data.map((item) => item.timestamp.split(',')[0]),
        datasets: [{
          label: 'Confidence of negative prediction',
          data: data.map((item) => item.probability * 100), // Reversed order of dataset values
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Successful Entries'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Confidence of Positive Prediction'
            },
            min: 0,
            max: 100,
          }
        }
      }
    });

    return () => {
      myChart.destroy();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="h-screen w-screen" data-theme="corporate">
        <h1 className="text-3xl font-bold mb-4">My Data for {params.disease}</h1>
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-lg loading-dots" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-screen w-screen flex justify-center items-center" data-theme="corporate">
        <div className="font-bold text-3xl">No data found </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-screen flex flex-col flex-wrap" data-theme="corperate">
      <div className="w-full p-6">
        <div className="flex flex-row justify-between items-center pb-6 pt-2 w-full">
          <h1 className="text-3xl font-bold">My Data for {DISEASE_NAMES[params.disease]}</h1>
          <div className="flex justify-center">
            <button onClick={() => { generateMyDataPDF(data) }} className="flex flex-row justify-center items-center bg-green-500 hover:bg-green-700 text-white text-xl font-bold py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
        <div className="card card-bordered rounded overflow-x-scroll mb-4">
          <div className="w-full">
            <h2 className="text-xl font-bold m-4">Last Five Entries</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Prediction</th>
                  <th>Probability</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {dataLimited.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-200" onClick={() => {
                    router.push('/mydata/diagnosis/' + item.docId)
                  }}>
                    <td>{item.prediction}</td>
                    <td>{((item.probability) * 100).toFixed(4)}%</td>
                    <td>{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="join grid grid-cols-2">
              <button className="join-item btn btn-outline" disabled={disablePrevious} onClick={() => {
                fetchPreviousData(currentUser);
              }}>Previous page</button>
              <button className="join-item btn btn-outline" disabled={disableNext} onClick={() => {
                fetchNextData(currentUser);
              }}>Next</button>
            </div>
          </div>
        </div>
        <div className="card card-bordered rounded h-[400px]">
          <h2 className="text-xl font-bold m-4">Chart: Confidence of Positive Prediction vs. Successful Entries</h2>
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default MyData;

