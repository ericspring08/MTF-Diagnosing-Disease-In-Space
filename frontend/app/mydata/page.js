'use client'
import { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { auth, firestore } from '../../utils/firebase'

const MyData = () => {
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        getDoc(docRef)
          .then((doc) => {
            if (doc.exists()) {
              console.log("Document data:", doc.data());
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } else {
        // User is signed out
        // ...
        router.push('/auth/signin')
      }
    });
  }, [])

  return (
    <div>
      <h1>My Data</h1>
    </div>
  )
}

export default MyData
