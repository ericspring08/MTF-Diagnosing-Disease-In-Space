'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, limit, startAfter, endBefore, getCountFromServer } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../../../../utils/firebase';
import { Chart, registerables } from 'chart.js';
import { generateMyDataPDF } from '../../../../utils/pdfgen';

const MyData = ({ params }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);
  const [lastVisibleIndex, setLastVisibleIndex] = useState(0);
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

    const q = query(collection(firestore, 'users', user.uid, 'results'), where('disease', '==', params.disease), orderBy('timestamp', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push({ id: doc.id, data: doc.data() });
    });

    setData(newData);

    setFirstVisible(querySnapshot.docs[0]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstVisibleIndex(1);
    setLastVisibleIndex(querySnapshot.docs.length);
    setLoading(false);
  }

  const fetchNextData = async (user) => {
    const q = query(collection(firestore, 'users', user.uid, 'results'), where('disease', '==', params.disease), orderBy('timestamp', 'desc'), limit(5), startAfter(lastVisible));
    const querySnapshot = await getDocs(q);
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push({ id: doc.id, data: doc.data() });
    });

    if (newData.length === 0) return;

    setData(newData);
    setFirstVisible(querySnapshot.docs[0]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstVisibleIndex(firstVisibleIndex + 5);
    setLastVisibleIndex(lastVisibleIndex + newData.length);

    if (lastVisibleIndex + newData.length === totalEntries - 1) {
      setDisableNext(true);
    }
    setDisablePrevious(false);
  }

  const fetchPreviousData = async (user) => {
    const q = query(collection(firestore, 'users', user.uid, 'results'), where('disease', '==', params.disease), orderBy('timestamp', 'desc'), limit(5), endBefore(firstVisible));
    const querySnapshot = await getDocs(q);
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push({ id: doc.id, data: doc.data() });
    });

    if (newData.length === 0) return;

    setData(newData);
    setFirstVisible(querySnapshot.docs[0]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setFirstVisibleIndex(firstVisibleIndex - newData.length);
    setLastVisibleIndex(lastVisibleIndex - 5);

    if (firstVisibleIndex - newData.length === 1) {
      setDisablePrevious(true);
    }
    setDisableNext(false);
  }

  useEffect(() => {
    Chart.register(...registerables);

    const ctx = document.getElementById('myChart');

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((item, index) => index + 1), // Successful entries on the x-axis
        datasets: [{
          label: 'Confidence of negative prediction',
          data: data.map(item => item.data.prediction.prediction === 1 ? 100 - item.data.prediction.probability : item.data.prediction.probability), // Adjusted confidence of negative prediction on the y-axis
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
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
              text: 'Confidence of Negative Prediction'
            }
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
      <div className="h-screen w-screen" data-theme="corperate">
        <h1 className="text-3xl font-bold mb-4">My Data for {params.disease}</h1>
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-lg loading-dots" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-screen w-screen" data-theme="corperate">
        <h1 className="text-3xl font-bold mb-4">My Data for {params.disease}</h1>
        <div className="flex justify-center items-center">
          <div className="card shadow-xl w-1/2">
            <div className="font-bold">No data found </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col flex-wrap" data-theme="corperate">
      <div className="flex flex-row justify-between items-center p-6 w-full">
        <h1 className="text-3xl font-bold">My Data for {params.disease}</h1>
        <div className="flex justify-center">
          <button onClick={() => { generateMyDataPDF(data) }} className="flex flex-row justify-center items-center bg-green-500 hover:bg-green-700 text-white text-xl font-bold py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
      <div className="card card-bordered rounded mx-5 w-full h-full">
        <h2 className="text-xl font-bold m-4">Last Five Entries</h2>
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Prediction</th>
              <th>Probability</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} onClick={() => {
                router.push('/mydata/diagnosis/' + item.id)
              }}>
                <td>{item.data.prediction.prediction}</td>
                <td>{item.data.prediction.prediction === 1 ? 100 - item.data.prediction.probability : item.data.prediction.probability}</td>
                <td>{new Date(item.data.timestamp.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="join grid grid-cols-2 m-4">
          <button className="join-item btn btn-outline" disabled={disablePrevious} onClick={() => {
            fetchPreviousData(currentUser);
          }}>Previous page</button>
          <button className="join-item btn btn-outline" disabled={disableNext} onClick={() => {
            fetchNextData(currentUser);
          }}>Next</button>
        </div>
      </div>
      <div>
      </div>
      <div className="card card-bordered rounded m-5 h-max">
        <h2 className="text-xl font-bold m-4">Chart: Confidence of Negative Prediction vs. Successful Entries</h2>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
};

export default MyData;

