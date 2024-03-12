'use client';
import { signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { auth } from './firebase'
import { onAuthStateChanged } from "firebase/auth";
import Link from 'next/link';

const Navbar = () => {

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setIsSignedIn(true)
      } else {
        setIsSignedIn(false)
      }
    });
  }, [])

  if (isSignedIn) {
    return (
      <div data-theme="coperate">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">Smart Diagnosis</Link>
          </div>
          <div className="flex-none">
            <Link href="mydata" className="btn btn-ghost mr-1">
              My Data
            </Link>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box">
                <li>
                  <div className="text-xl">{user.email}</div>
                </li>
                <li>
                  <Link href="/settings">Settings</Link>
                </li>
                <li><div onClick={() => { signOut(auth) }}>Logout</div></li>
              </ul>
            </div>
          </div>
        </div>
      </div >
    )
  } else {
    return (
      <div data-theme="coperate">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">Smart Diagnosis</Link>
          </div>
          <div className="flex-none mr-1">
            <Link href="/auth/signup" className="btn btn-ghost">Sign Up</Link>
          </div>
          <div className="flex-none">
            <Link href="/auth/signin" className="btn btn-primary text-white">Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

}

export default Navbar;
