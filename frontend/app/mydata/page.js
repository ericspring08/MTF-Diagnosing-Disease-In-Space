'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { doc, getDocs, collection, orderBy, limit, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { auth, firestore } from '../../utils/firebase'

const MyData = () => {
  const router = useRouter()
  const [data, setData] = useState([])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
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
      <div className="flex justify-center mt-4 space-x-4">
        {['hdd', 'kdd', 'ldd', 'tdd'].map((category, index) => (
          <Link href={`/mydata/specdata/${category}`} key={index}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              See All Predictions for {category.toUpperCase()}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}
export default MyData;
