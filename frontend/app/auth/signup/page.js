'use client';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { firestore } from '../../../utils/firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from '../../../utils/firebase';
import { useRouter } from 'next/navigation';
import GoogleButton from 'react-google-button'
import Link from 'next/link';
import Navbar from "../../../utils/Navbar"

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/')
      }
    });
  }, [])

  const emailSignUp = () => {
    console.log(email, password)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        createUserData(userCredential.user);
        router.push('/')
      })
  }

  const googleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createUserData(user);
        router.push('/')
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });

  }

  const createUserData = (user) => {
    const userRef = doc(firestore, "users", user.uid);
    setDoc(userRef, {
      email: user.email,
      uid: user.uid,
      accountCreationDate: serverTimestamp()
    });
  }

  return (
    <div data-theme="corperate">
      <Navbar />
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="card shadow-xl xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-2/3 p-10 flex flex-col justify-center items-center">
          <h1 className="text-3xl py-5">Sign Up</h1>
          <input type="text" placeholder="Email" className="input input-bordered w-full my-1" value={email} onChange={(e) => {
            setEmail(e.target.value)
          }} />
          <input type="password" placeholder="Password" className="input input-bordered w-full my-2" value={password} onChange={(e) => {
            setPassword(e.target.value)
          }} />
          <button className="btn btn-success text-white w-full" onClick={emailSignUp}>Sign Up With Email And Password</button>
          <div className="text-lg text-gray-600">or</div>
          <GoogleButton className="my-2" label="Sign up with Google" onClick={googleSignUp} />
          <Link href="/auth/signin" className="text-blue-500">Already have an account? Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
