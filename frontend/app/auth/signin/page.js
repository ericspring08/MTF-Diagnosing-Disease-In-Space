'use client';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../../utils/firebase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleButton from 'react-google-button'

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signinError, setSigninError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/')
      }
    });
  }, [])

  const emailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push('/')
      }).catch((error) => {
        setSigninError(true)
        setEmail('')
        setPassword('')
      })
  }

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        router.push('/')
      })
  }

  const AlertError = () => {
    if (!signinError) {
      return null
    }
    return (
      <div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Invalid Email or Password</span>
      </div>
    )
  }

  return (
    <div data-theme="corperate">
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="card shadow-xl xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-2/3 p-10 flex flex-col justify-center items-center">
          <h1 className="text-3xl py-5">Sign In</h1>
          <input type="text" placeholder="Email" value={email} className="input input-bordered w-full my-1" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} className="input input-bordered w-full my-1" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={emailSignIn} className="btn btn-success text-white w-full my-2">Sign In</button>
          <AlertError />
          <div className="text-lg text-gray-500 my-2">or</div>
          <GoogleButton onClick={googleSignIn} />
          <Link href="/auth/signup" className="text-blue-500 my-2">Don't have an account? Sign Up</Link>
        </div>
      </div>

    </div>
  );
}

export default SignIn;
