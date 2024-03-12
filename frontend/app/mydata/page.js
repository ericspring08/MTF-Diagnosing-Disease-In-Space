'use client'
import { useEffect, useState } from 'react'
import { doc, getDocs, collection } from "firebase/firestore";
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
        await getDocs(collectionRef).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // add data to state array
            setData(prev => [...prev, doc.data()])
          });
        });
      } else {
        // User is signed out
        // ...
        router.push('/auth/signin')
      }
    });
  }, [])

  return (
    <div className="h-screen w-screen" data-theme="corperate">
      <h1>My Data</h1>
      <div className="flex justify-center items-center">
        {
          data.map((item, index) =>
            <div className="card shadow-xl w-1/2" key={index}>
              <div>{item.disease}</div>
              <div>{item.prediction.prediction}</div>
              <div>{item.prediction.probability}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default MyData