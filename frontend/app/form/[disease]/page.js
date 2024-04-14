'use client';
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { generateDiagnosisPDF } from '../../../utils/pdfgen';
import Form from './form';
import { auth, firestore } from '../../../utils/firebase';
import { addDoc, collection, serverTimestamp, arrayUnion, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { query, orderBy, limit, getDocs } from 'firebase/firestore';
import godirect from '@vernier/godirect';
import { detectPeaks, calculateRRIntervals, findMaxima, findMinima, measureSegmentSlope, detectEKGNormalcy } from '@/utils/ekgfunctions'; // Import functions from ekgfunctions.js
import axios from 'axios';

const Page = ({ params }) => {
  // let ekgChart; // Initialize EKG chart
  const [error, setError] = useState(null);
  const [formIndex, setFormIndex] = React.useState(0);
  const [formStructure, setFormStructure] = React.useState({});
  const [formHeaders, setFormHeaders] = React.useState([]);
  const [formData, setFormData] = React.useState({});
  const [disableNext, setDisableNext] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [predictionResults, setPredictionResults] = React.useState(null);
  const [formName, setFormName] = React.useState('');
  const [ekgDataValues, setEkgDataValues] = useState(null); // State variable to store calculated EKG data values
  const [sensorDataPoints, setSensorDataPoints] = useState([]); // Array to store all sensor data points
  const [numSensors, setNumSensors] = useState(null);

  useEffect(() => {
    if (formHeaders.length > 0 && formHeaders[formIndex]) {
      const keysForPage = Object.keys(
        formStructure[formHeaders[formIndex]],
      );

      let requiredFieldsPresent = false;

      for (const key of keysForPage) {
        if (formData[key] === '') {
          requiredFieldsPresent = true;
          break;
        }
      }

      setDisableNext(requiredFieldsPresent);
    }
  }, [formData, formIndex, formStructure, formHeaders]);

  const uploadResults = async (formData, results) => {
    try {
      const user = auth.currentUser;
      // add new doc to /users/{userId}/results collection
      const collectionRef = collection(firestore, "users", user.uid, "results");
      const docData = {
        disease: params.disease,
        diseaseName: formName,
        formData: formData,
        prediction: results,
        timestamp: serverTimestamp(),
        // TODO: upload to new document/array store in document 'graphing' in user folder 
        //time stamp and probability of positive, map of all data, use diagnosis ID as key 
        // just use data.filter with buttons for view by ___ week month year
      };

      let docId = '';
      await addDoc(collectionRef, docData).then((response) => {
        // get the new doc id
        console.log('Document written with ID: ', response.id);
        docId = response.id;
      })
      if (results.prediction == 0) {
        results.probability = 1 - results.probability;
      }
      // upload to graphing Document
      const userRef = doc(firestore, "users", user.uid);
      const temp_id = params.disease + '-' + 'graphing';
      // add to the array on field params.disease
      // use temp_id as the key for the field
      await updateDoc(userRef, {
        [temp_id]: arrayUnion({
          timestamp: Timestamp.now(),
          probability: results.probability,
          docId: docId
        })
      });
    } catch (error) {
      console.error('Error uploading results:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      const res = await axios.post(
        `/api/predict/${params.disease}`,
        formData,
      );
      const { prediction, probability, description } = res.data;
      // upload results to firestore if logged in
      uploadResults(formData, { prediction, probability });
      setPredictionResults({ prediction, probability, description });
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  const handleReset = () => {
    setFormIndex(0);
    setSubmitted(false);
    setPredictionResults(null);
    const resetData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});

    setFormData(resetData);
  };

  const uploadJsonHandler = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = JSON.parse(e.target.result);
        // go through every key in the data and set the form data if it exists
        for (const key in data) {
          if (formData.hasOwnProperty(key)) {
            setFormData((prev) => {
              return {
                ...prev,
                [key]: data[key],
              };
            })
          }
        }
      }
      reader.readAsText(file);
    }
    fileInput.click();
  }

  const downloadJsonTemplate = () => {
    const data = {};
    for (const key in formData) {
      data[key] = '';
    }
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = params.disease + '_form.json';
    a.click();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/get_features?disease=${params.disease}`,
        );
        const { features, form, diseaseName } = response.data;

        // Initialize form data, structure, and headers
        const newFormData = {};
        for (const element of features) {
          newFormData[element] = '';
        }

        setFormData(newFormData);
        setFormHeaders(Object.keys(form));
        setFormStructure(form);
        setFormName(diseaseName)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);





  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center" data-theme="corporate">
      {submitted ? (
        predictionResults === null ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          <div>
            <h1 className="text-6xl">Prediction Result</h1>
            <div>
              <p className="text-2xl">Prediction: {predictionResults.prediction === 0 ? 'Negative' : 'Positive'}</p>
              <p className="text-2xl">Confidence: {Math.round(predictionResults.probability * 100)}%</p>
              <div className="pb-5">
                {predictionResults.prediction === 0 ? (
                  <progress className="progress progress-warning" value={predictionResults.probability * 100} max="100" />
                ) : (
                  <progress className="progress progress-success" value={predictionResults.probability * 100} max="100" />
                )}
              </div>
              <div className="flex flex-row justify-between">
                <button className="btn btn-warning" onClick={handleReset}>Reset Form</button>
                <button className="btn btn-success ml-5" onClick={() => { generateDiagnosisPDF(formName, formData, predictionResults.prediction, predictionResults.probability); }}>Save as PDF</button>
                <a href="/" className="btn btn-info">Go To Home</a>
              </div>
              {/* Display diagnosis explanation based on prediction */}
              <div className="text-xl mt-5">
                <div className="max-w-lg mx-auto">
                  <p>
                    {predictionResults.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      ) : formHeaders.length === 0 ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : (
        <div className="p-5 m-5 card card-bordered rounded mt-10">
          <div className="mb-4">
            <p>
              Page {formIndex + 1} of {formHeaders.length}
            </p>
          </div>

          <h1 className="text-6xl">{formName}</h1>
          <Form
            formStructure={formStructure}
            formHeaders={formHeaders}
            formIndex={formIndex}
            formData={formData}
            setFormData={setFormData}
          />
          <div className="flex flex-row justify-between">
            <button
              onClick={() => {
                if (formIndex > 0) {
                  setFormIndex(formIndex - 1);
                }
              }}
              className="btn btn-warning mt-5 mb-5"
              disabled={formIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
                />
              </svg>
            </button>
            {(formIndex === formHeaders.length - 1 && params.disease === "hdd") && (
              <AutoFillFormEKG setFormData={setFormData} />
            )}
            <button
              onClick={() => {
                setFormIndex(formIndex + 1);
              }}
              className="btn btn-info mt-5 mb-5"
              disabled={disableNext}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {
        !submitted && formHeaders.length > 0 && (
          <div className="flex flex-row flex-wrap justify-center gap-2 m-5">
            <button className="btn btn-lg btn-primary text-white" onClick={uploadJsonHandler}>Upload JSON</button>
            <button className="btn btn-lg btn-secondary text-white" onClick={downloadJsonTemplate}>Download JSON Template</button>
          </div>
        )
      }
    </div>
  );
};

const AutoFillFormEKG = ({ setFormData }) => {
  const [error, setError] = useState(null);
  const [ekgDataValues, setEkgDataValues] = useState(null);

  const autoFillFormFromFirestore = async () => {
    try {
      const ekgDevice = await godirect.selectDevice();
      if (!ekgDevice) {
        setError('Failed to select the EKG device.');
        return;
      }

      console.log('Available sensors:', ekgDevice.availableSensors);
      setNumSensors(ekgDevice.availableSensors.length);

      const enabledSensors = ekgDevice.sensors.filter(s => s.enabled);

      let dataPointCount = 0;

      let peaks;
      let rrIntervals;
      let maxima;
      let minima;
      let segmentLength;
      let normalcy;

      const ctx = document.getElementById('ekgChart'); // Move the chart initialization here
      const ekgChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'EKG Data',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            data: [],
            fill: false
          }]
        },
        options: {
          scales: {
            x: {
              display: false
            }
          }
        }
      });

      const handleValueChanged = (sensor) => {
        // Use ekgChart inside handleValueChanged function
        if (ekgChart.data.datasets[0].data.length < 300) {
          console.log(`Sensor: ${sensor.name} value: ${sensor.value} units: ${sensor.unit}`);

          ekgChart.data.labels.push('');
          sensorDataPoints.push(sensor.value);
          ekgChart.data.datasets[0].data.push(sensor.value);
          ekgChart.update();

          const threshold = 0.275; // You can adjust this value as needed
          const samplingRate = 1;
          peaks = detectPeaks(ekgChart.data.datasets[0].data, threshold);
          rrIntervals = calculateRRIntervals(peaks, samplingRate);
          maxima = findMaxima(ekgChart.data.datasets[0].data);
          minima = findMinima(ekgChart.data.datasets[0].data);
          segmentLength = measureSegmentSlope(ekgChart.data.datasets[0].data, peaks);
          normalcy = detectEKGNormalcy(ekgChart.data.datasets[0].data, peaks, rrIntervals, maxima);
          dataPointCount++;

          if (dataPointCount === 300) {
            setEkgDataValues({
              peaks,
              rrIntervals,
              maxima,
              minima,
              segmentLength,
              normalcy,
            });
            dataPointCount = 0;
          }

          // Auto fill form data
          // thalach: Maximum heart rate achieved
          setFormData((prev) => {
            return {
              ...prev,
              thalach: 3600 / rrIntervals[0],
            };
          });
          // restecg: Resting electrocardiographic results
          setFormData((prev) => {
            return {
              ...prev,
              restecg: normalcy,
            };
          });

        } else {
          console.log('Stopped logging after 300 data points.');
          enabledSensors.forEach(sensor => sensor.off('value-changed', handleValueChanged));
        }
      };

      enabledSensors.forEach(sensor => sensor.on('value-changed', handleValueChanged));
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'device_selection_failed') {
        setError('Failed to select the EKG device.');
      } else if (error.code === 'connection_failed') {
        setError('Failed to connect to the EKG device.');
      } else if (error.code === 'start_measurements_failed') {
        setError('Failed to start EKG measurements.');
      } else {
        setError('An error occurred while connecting to the EKG device.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="btn btn-primary w-36"
        onClick={autoFillFormFromFirestore} // Add onClick handler for auto fill button
      >
        Auto Fill
      </button>
      {
        error !== null && (
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Error! {error}</span>
          </div>
        )
      }
      {
        ekgDataValues !== null && (
          <canvas id="ekgChart" width="300" height="150"></canvas>
        )
      }
    </div>
  )
}

export default Page;
