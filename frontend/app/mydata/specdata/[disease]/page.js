'use client'
import { useEffect, useState } from 'react'
import { doc, getDocs, collection, orderBy, query, where, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { auth, firestore } from '../../../../utils/firebase'

const MyData = ({ params }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const collectionRef = collection(firestore, "users", user.uid, "results");
        // Query the collection, filter by disease, order by timestamp and limit to 5
        const q = query(collectionRef, where("disease", "==", params.disease), orderBy("timestamp", "desc"), limit(5));

        await getDocs(q).then((querySnapshot) => {
          const newData = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.data())
            newData.push(doc.data());
          });
          setData(newData);
          setLoading(false);
        });
      } else {
        router.push('/auth/signin')
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen" data-theme="corperate">
        <h1 className="text-3xl font-bold mb-4">My Data for {params.disease}</h1>
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-lg loading-dots" />
        </div>
      </div >)
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
    )
  }

  return (
    <div className="h-screen w-screen" data-theme="corperate">
      <h1 className="text-3xl font-bold mb-4">My Data for {params.disease}</h1>
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
