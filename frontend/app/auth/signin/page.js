'use client';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../utils/firebase';
import { useState, useEffect } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        const uid = user.uid;
        console.log(uid)
        // ...
      } else {
        // User is signed out.
        // ...
        console.log("signed out")
      }
    });
  }, [])

  const emailSignIn = () => {
    console.log(email, password)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });


  }

  return (
    <div data-theme="corperate">
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="card w-1/2 shadow-xl p-10">
          <h1 className="text-3xl py-5">Sign In</h1>
          <input type="text" placeholder="Email" value={email} className="input input-bordered w-full my-1" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} className="input input-bordered w-full my-1" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={emailSignIn} className="btn btn-success text-white">Sign In</button>
        </div>
      </div>

    </div>
  );
}

export default SignIn;
