// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8EI2CUPDnQQN6mRGxC1RkLHzDqYiROOc",
  authDomain: "nasahunch-7ca6f.firebaseapp.com",
  projectId: "nasahunch-7ca6f",
  storageBucket: "nasahunch-7ca6f.appspot.com",
  messagingSenderId: "895243385927",
  appId: "1:895243385927:web:c6207f277087cf23274562",
  measurementId: "G-WXTWQ6S2BS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const firebase = app;
