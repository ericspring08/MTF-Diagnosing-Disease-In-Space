'use client'
import { onAuthStateChanged, deleteUser } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Settings = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setLoading(false)
      } else {
        router.push('/auth/signin')
      }
    })
  })

  if (loading) {
    return <span className="loading loading-dots loading-lg" data-theme="corporate"></span>
  }

  const deleteAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        router.push('/auth/signin')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div data-theme="corporate h-screen w-screen flex flex-col items-center">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="pl-10 font-bold text-4xl pt-10">Account Settings</h1>
          <div className="ml-10 my-1 text-lg font-light">Change your account settings</div>
        </div>
        <div className="pr-10 font-bold text-3xl">{user.email}</div>
      </div>
      <div className="card shadow-xl m-10 p-5">
        <div className="font-bold text-2xl pb-1">Delete My Account</div>
        <button className="btn btn-error w-64" onClick={deleteAccount}>Delete Account</button>
      </div>
    </div>
  )
}

export default Settings
