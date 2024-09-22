"use client";

import { setVerificationDetails } from '@/redux_state/authSlice';
import { AppDispatch } from '@/redux_state/store';
//import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

export default function VerificationPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false)
  const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const emailParam = queryParams.get('email');
      console.log(emailParam)
      const tokenParam = queryParams.get('token');
      console.log(tokenParam)
      //const router = useRouter()
      
      if (emailParam && tokenParam) {
        setEmail(emailParam);
        setToken(tokenParam);
        // Dispatch your Redux action here if needed
        setVerified(true);
        dispatch(setVerificationDetails({email, token}))
        //router.push('/signup')
  
    } else {
        // Handle missing parameters
        console.error("Email or token is missing");
    }
}, [dispatch, email, token]);
  return (
    <div>
        {verified ? (<div>
          <h2>Success!!</h2>
          <p>You have been verified!</p>
          </div>) : (<div>
            <h2>Verification failed</h2>
            <p>Invalid authentication token</p>
            <p>You will be redirected to the verification page</p>
          </div>)}
    </div>

  )
}

