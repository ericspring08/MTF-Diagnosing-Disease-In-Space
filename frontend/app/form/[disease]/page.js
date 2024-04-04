'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { generateDiagnosisPDF } from '../../../utils/pdfgen';
import Form from './form';
import { auth, firestore } from '../../../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { query, orderBy, limit, getDocs } from 'firebase/firestore';

const Page = ({ params }) => {
  const [formIndex, setFormIndex] = React.useState(0);
  const [formStructure, setFormStructure] = React.useState({});
  const [formHeaders, setFormHeaders] = React.useState([]);
  const [formData, setFormData] = React.useState({});
  const [disableNext, setDisableNext] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [predictionResults, setPredictionResults] = React.useState(null);
  const [formName, setFormName] = React.useState('');

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
      const { prediction, probability } = res.data;
      // upload results to firestore if logged in
      onAuthStateChanged(auth, (user) => {
        if (user) {
          uploadResults(formData, { prediction, probability });
        }
      });
      setPredictionResults({ prediction, probability });
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

  const autoFillForm = async () => {
    const user = auth.currentUser;
    if (user) {
      const ekgDataCollection = collection(firestore, 'users', user.uid, 'ekgData');
      const q = query(ekgDataCollection, orderBy('timestamp', 'desc'), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const latestData = snapshot.docs[0].data();
        setFormData(prevFormData => ({
          ...prevFormData,
          'Slope of the Peak Exercise ST Segment': latestData.segmentLength || '',
          'Resting Electrocardiographic Results': latestData.normalcy || ''
        }));
      }
    }
  };

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
              {params.disease === 'hdd' && (
                <div className="text-xl mt-5">
                  {predictionResults.prediction === 0 ? (
                    <div className="max-w-lg mx-auto">
                      <p>
                        Based on your diagnosis, it's reassuring to confirm that you are not currently at risk for significant heart conditions such as coronary artery disease, arrhythmia, or impending heart failure. However, your symptomatology is concerning as it suggests a potential risk for heart disease in the future. It's vital to consider lifestyle changes to mitigate this risk. This conclusion is supported by 90% of patients who present similar symptoms and are found to be in good health upon examination. This conclusion was made with the help of information from the National Heart, Lung, and Blood Institute’s publication Your Guide to a Healthy Heart.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-lg mx-auto">
                      <p>
                        Based on your diagnosis, it's concerning to note that you are at risk for significant heart conditions such as coronary artery disease, arrhythmia, or impending heart failure. Immediate medical attention is advised for a more in-depth diagnosis and exploration of treatment options. This conclusion is supported by a dataset of over 1000 patients with varying levels of symptoms of cardiovascular distress. This conclusion was made with the help of information from the National Heart, Lung, and Blood Institute’s publication Your Guide to a Healthy Heart.
                      </p>
                    </div>
                  )}
  
                  {/* Additional message based on specific criteria */}
                  {formData.cholesterol >= 240 || formData.restingSystolicBloodPressure > 140 || formData.maxHeartRate > 155 ? (
                    <div className="max-w-lg mx-auto mt-4">
                      <p>
                        Based on your diagnosis, it's reassuring to confirm that you are not currently at risk for significant heart conditions such as coronary artery disease, arrhythmia, or impending heart failure. However, your symptomatology is concerning as it suggests a potential risk for heart disease in the future. It's vital to consider lifestyle changes to mitigate this risk. This conclusion is supported by 90% of patients who present similar symptoms and are found to be in good health upon examination. This conclusion was made with the help of information from the National Heart, Lung, and Blood Institute’s publication Your Guide to a Healthy Heart.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
  
              {/* Display diagnosis explanation for thyroid */}
              {params.disease === 'tdd' && (
                <div className="text-xl mt-5">
                  {predictionResults.prediction === 0 ? (
                    <div className="max-w-lg mx-auto">
                      <p>
                        Your recent diagnosis suggests that your thyroid function is moderate to above average, with no signs of hypothyroidism. This indicates a healthy thyroid status for now. However, it's still important to stay vigilant and schedule periodic check-ups to ensure ongoing thyroid health.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-lg mx-auto">
                      <p>
                        Your diagnosis indicates hypothyroidism, requiring prompt medical attention. It's crucial to consult with a healthcare professional for further evaluation and management. Early intervention and treatment can help address symptoms and prevent potential complications associated with hypothyroidism.
                      </p>
                    </div>
                  )}
                </div>
              )}
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
            {formIndex === formHeaders.length - 1 ? (
              <>
                <button
                  className="btn btn-primary ml-5"
                  onClick={autoFillForm} // Add onClick handler for auto fill button
                >
                  Auto Fill
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-success mt-5 mb-5"
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
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );  
};

export default Page;
