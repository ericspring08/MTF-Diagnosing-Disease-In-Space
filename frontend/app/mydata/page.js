'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { getDocs, collection, orderBy, limit, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { auth, firestore } from '../../utils/firebase'
import axios from 'axios'

const MyData = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [diseases, setDiseases] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // fetch the disease options from api
        let promise = axios.get('/api/diseases');
        promise.then((response) => {
          setDiseases(response.data.diseases);
        });
        // fetch the last 5 results from the user's collection
        const collectionRef = collection(firestore, "users", user.uid, "results");
        const q = query(collectionRef, orderBy("timestamp", "desc"), limit(5));

        await getDocs(q).then((querySnapshot) => {
          const newData = [];
          // check if the querySnapshot is empty
          if (querySnapshot.empty) {
            console.log('No matching documents.');
          } else {
            querySnapshot.forEach((doc) => {
              newData.push(doc.data());
            })
            setData(newData);
          }
        }).catch((error) => {
          console.error("Error getting documents: ", error);
        })
      } else {
        // User is signed out
        // ...
        router.push('/auth/signin')
      }
    });
  }, [])

  const DiseaseCards = () => {
    if (diseases) {
      return (
        <div className="flex justify-center mt-4 space-x-4">
          {diseases.map((category, index) => (
            <Link href={`/mydata/specdata/${category.value}`} key={index}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                See All Predictions for {diseases[index].label}
              </button>
            </Link>
          ))}
        </div>
      )
    }
  }


  if (data.length == 0) {
    return (
      <div className="h-screen w-screen" data-theme="corperate">
        <h1 className="text-3xl font-bold mb-4">My Data</h1>
        <div className="flex justify-center items-center">
          <div className="card shadow-xl w-1/2">
            <div className="font-bold">No data available</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen" data-theme="corperate">
      <h1 className="text-3xl font-bold mb-4">My Data</h1>
      <div className="flex justify-center items-center">
        {
          data.map((item, index) =>
            <div className="card shadow-xl w-1/2" key={index}>
              <div className="font-bold">{item.disease}</div>
              <div>{item.prediction.prediction}</div>
              <div>{item.prediction.probability}</div>
              <div>Timestamp: {new Date(item.timestamp.seconds * 1000).toLocaleString()}</div>
            </div>
          )
        }
      </div>
      <DiseaseCards />
    </div>
  )
}
export default MyData;
