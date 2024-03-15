'use client'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, where, limit, startAfter, endBefore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { auth, firestore } from '../../../../utils/firebase'

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
  
        const newData = querySnapshot.docs.map((doc) => doc.data());
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
  
        const newData = querySnapshot.docs.map((doc) => doc.data());
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
            <div className="font-bold">No data found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen" data-theme="corperate">
      <h1 className="text-3xl font-bold p-6">My Data for {params.disease}</h1>
      <div className="overflow-x-auto w-screen">
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
              <tr key={index}>
                <td>{item.prediction.prediction}</td>
                <td>{item.prediction.probability}</td>
                <td>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</td>
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
    </div>
  );
};

export default MyData;
