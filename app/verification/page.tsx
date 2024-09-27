"use client";

import { setVerificationDetails } from '@/redux_state/authSlice';
import { AppDispatch } from '@/redux_state/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function VerificationPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [defaultView, setDefaultView] = useState(true);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
    

  useEffect(() => {
    document.title = "Get Cassava - Verification Result";
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get('email');
    const tokenParam = queryParams.get('token');

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);

      setTimeout(() => {
        setVerified(true);
      }, 1500);
    } else {
      console.error("Email or token is missing");
      setTimeout(() => {
        setDefaultView(false);
      }, 1500);

      setTimeout(() => {
        router.push('/verify');
      }, 3000);
    }
  }, [dispatch, router]);

  if (verified){
    dispatch(setVerificationDetails({ email, token }));
    setTimeout(() => {
      router.push('/signup');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-4 bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Verification Status</h2>
        
        {defaultView && !verified ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#307268] mb-4"></div>
            <p className="text-lg">Verifying user...</p>
          </div>
        ) : verified ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-2">Success!!</h2>
            <p className="text-lg text-[#307268]">You have been verified!</p>
            <p className="text-sm text-[#307268] mt-2">You will be redirected to the sign up page shortly...</p>
          </div>
        ) :  (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-lg text-[#307268]">Invalid authentication token</p>
            <p className="text-sm text-[#307268] mt-2">You will be redirected to the verification page shortly...</p>
          </div>
        )}
      </div>
    </div>
  );
}
