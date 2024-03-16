'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, limit, startAfter, endBefore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../../../../utils/firebase';
import { Chart, registerables } from 'chart.js';
import { generateMyDataPDF } from '../../../../utils/pdfgen';

const MyData = ({ params }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchDataNext();
  }, []);

  const fetchDataNext = async () => {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });

    if (user) {
      try {
        const collectionRef = collection(firestore, "users", user.uid, "results");
        let q = query(collectionRef, where("disease", "==", params.disease), orderBy("timestamp", "desc"), limit(5));

        if (data.length > 0) {
          q = query(q, startAfter(data[data.length - 1].timestamp));
        }

        const querySnapshot = await getDocs(q);

        const newData = querySnapshot.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        console.log(newData)
        setData(newData);
        setHasNextPage(newData.length === 5);
        setLoading(false);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    } else {
      router.push('/auth/signin');
    }
  };

  const fetchDataPrevious = async () => {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });

    if (user) {
      try {
        const collectionRef = collection(firestore, "users", user.uid, "results");
        let q = query(collectionRef, where("disease", "==", params.disease), orderBy("timestamp", "desc"), limit(5));

        if (data.length > 0) {
          q = query(q, endBefore(data[0].timestamp));
        }

        const querySnapshot = await getDocs(q);

        const newData = querySnapshot.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setData(newData);
        setHasNextPage(true);
        setLoading(false);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    } else {
      router.push('/auth/signin');
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchDataNext();
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    fetchDataPrevious();
  };

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
    <div className="h-screen w-screen" data-theme="corperate">
      <div className="flex flex-row justify-between items-center p-6">
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
      <div className="mx-5 card card-bordered rounded overflow-x-auto w-screen">
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
      </div>
      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handlePreviousPage}>
            Back
          </button>
        )}
        {hasNextPage && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNextPage}>
            Next
          </button>
        )}
      </div>
      <div className="card card-bordered rounded m-5">
        <h2 className="text-xl font-bold m-4">Chart: Confidence of Negative Prediction vs. Successful Entries</h2>
        <canvas id="myChart" width="800" height="400"></canvas>
      </div>
    </div>
  );
};

export default MyData;

