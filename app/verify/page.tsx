"use client";

import { verifyUser } from '@/redux_state/authSlice'
import { AppDispatch } from '@/redux_state/store'
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function GetVerified() {
  const [email, setEmail] = useState<string>('')
  const dispatch: AppDispatch = useDispatch()
  const router = useRouter()

  const handleVerification = (e: FormEvent) => {
    e.preventDefault()
    // send verification email to the entered email
    router.push('/')
    dispatch(verifyUser({email}))
  }

  return (
    <div>
      <h2>Verification Page</h2>
      <form onSubmit={handleVerification}>
        <label htmlFor="email">Enter your email</label>
        <input className='block border border-teal-100' type="text" placeholder='enter email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button type="submit" className='bg-slate-800 p-2 text-white block hover:bg-slate-400'>verify</button>
      </form>
    </div>
  )
}
