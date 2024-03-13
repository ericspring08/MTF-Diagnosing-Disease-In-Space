'use client'
import { useEffect, useState } from 'react'
import { doc, getDocs, collection, orderBy, query, where, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/router'
import { auth, firestore } from '../../utils/firebase'

const MyData = () => {
  const router = useRouter();
  const { disease } = router.query; 
  const [data, setData] = useState([]);

  useEffect(() => {
    if (disease) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const collectionRef = collection(firestore, "users", user.uid, "results");
          // Query the collection, filter by disease, order by timestamp and limit to 5
          const q = query(collectionRef, where("disease", "==", disease), orderBy("timestamp", "desc"), limit(5));
          
          await getDocs(q).then((querySnapshot) => {
            const newData = [];
            querySnapshot.forEach((doc) => {
              newData.push(doc.data());
            });
            setData(newData);
          });
        } else {

        }
      });
    }
  }, [disease]);

  return (
    <div className="h-screen w-screen" data-theme="corperate">
      <h1 className="text-3xl font-bold mb-4">My Data for {disease}</h1>
      <div className="flex justify-center items-center">
        {
          data.map((item, index) =>
            <div className="card shadow-xl w-1/2" key={index}>
              <div className="font-bold">{item.disease}</div>
              <div>{item.prediction.prediction}</div>
              <div>{item.prediction.probability}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MyData;
