'use client';
import Link from 'next/link'; 
import { useEffect, useState } from 'react';
import { getDocs, collection, orderBy, query } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from 'next/navigation'; 
import { auth, firestore } from '../../utils/firebase';
import axios from 'axios';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const MyData = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [diseases, setDiseases] = useState(null);
  const [entriesByDay, setEntriesByDay] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let promise = axios.get('/api/diseases');
        promise.then((response) => {
          setDiseases(response.data.diseases);
        });
        const collectionRef = collection(firestore, "users", user.uid, "results");
        const q = query(collectionRef, orderBy("timestamp", "desc"));

        await getDocs(q).then((querySnapshot) => {
          const newData = [];
          const entriesMap = {};
          if (querySnapshot.empty) {
            console.log('No matching documents.');
          } else {
            querySnapshot.forEach((doc) => {
              const item = doc.data();
              newData.push(item);
              const date = new Date(item.timestamp.seconds * 1000).toLocaleDateString();
              if (!entriesMap[date]) {
                entriesMap[date] = 0;
              }
              entriesMap[date]++;
            });
            setData(newData);
            setEntriesByDay(entriesMap);
          }
        }).catch((error) => {
          console.error("Error getting documents: ", error);
        });
      } else {
        // User is signed out
        router.push('/auth/signin');
      }
    });
  }, []);

  const DiseaseCards = () => {
    if (diseases) {
      return (
        <div className="flex justify-center items-center flex-wrap">
          {diseases.map((category, index) => (
            <Link href={`/mydata/specdata/${category.value}`} key={index}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 m-1 text-xl rounded">
                See All Predictions for {diseases[index].label}
              </button>
            </Link>
          ))}
        </div>
      );
    }
  };

  // Function to generate PDF
  const generatePDF = () => {
    const docDefinition = {
      content: [
        { text: 'My Data', style: 'header' },
        { text: `Date Generated: ${new Date().toLocaleDateString()}`, style: 'date' },
        { text: '\n' },
        { text: 'Last Ten Entries', style: 'subheader' },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Disease', 'Prediction', 'Probability', 'Timestamp'],
              ...data.slice(0, 10).map(item => [item.disease, item.prediction.prediction, item.prediction.probability, new Date(item.timestamp.seconds * 1000).toLocaleString()])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        date: {
          fontSize: 12,
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('my_data.pdf');
  };

  return (
    <div className="flex flex-wrap justify-center items-center h-screen w-screen" data-theme="corporate">
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold">My Data</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Entries by Category</h2>
            <div className="bg-white p-4 rounded shadow">
              {diseases && diseases.map((category) => (
                <div key={category.value} className="flex justify-between items-center mb-2 border-b py-2">
                  <span>{category.label}</span>
                  <span>{data.filter(item => item.disease === category.value).length}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Entries by Day</h2>
            <div className="bg-white p-4 rounded shadow overflow-y-auto max-h-80">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-gray-100">Date</th>
                    <th className="border px-4 py-2 bg-gray-100">Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(entriesByDay).map(([date, count], index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border px-4 py-2">{date}</td>
                      <td className="border px-4 py-2">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table table-zebra">
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
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <th className="font-bold border px-4 py-2">{item.disease}</th>
                  <td className="border px-4 py-2">{item.prediction.prediction}</td>
                  <td className="border px-4 py-2">{item.prediction.probability}</td>
                  <td className="border px-4 py-2">{new Date(item.timestamp.seconds * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DiseaseCards />
        <div className="flex justify-center mt-6">
          <button onClick={generatePDF} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyData;
