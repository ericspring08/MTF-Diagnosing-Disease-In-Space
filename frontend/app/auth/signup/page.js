'use client';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../utils/firebase';
import { useRouter } from 'next/navigation';

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
        router.push('/')
      })
  }

  return (
    <div data-theme="corperate">
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="card shadow-xl xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-2/3 p-10">
          <h1 className="text-3xl py-5">Sign Up</h1>
          <input type="text" placeholder="Email" className="input input-bordered w-full my-1" value={email} onChange={(e) => {
            setEmail(e.target.value)
          }} />
          <input type="password" placeholder="Password" className="input input-bordered w-full my-1" value={password} onChange={(e) => {
            setPassword(e.target.value)
          }} />
          <button className="btn btn-success text-white" onClick={emailSignUp}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
