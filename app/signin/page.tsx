"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/redux_state/authSlice';
import { AppDispatch, RootState } from '@/redux_state/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as z from "zod";

// Form data schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignIn() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const error = useSelector((state: RootState) => state.auth.error);
  const {user} = useSelector((state: RootState) => state.auth)
  // const {id, loginToken} = user

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    await dispatch(loginUser({ email, password }));
    if (user){
      router.push('/dashboard')
    }
  };

  useEffect(() => {
    document.title = "Get Cassava - Sign in";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg p-8 my-12 bg-white shadow-lg rounded-lg space-y-4">
        {/* Logo and Welcome Text */}
        <div className="mb-6">
          <img
            src="/auth-img/auth-logo.png"
            alt="Get Cassava Logo"
            className="mx-auto h-16 w-16"
          />
        </div>
        <h2 className="text-2xl font-semibold text-black text-center">Welcome Back!</h2>
        <p className="text-black text-center">Log back into your GetCassava account.</p>

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="w-full max-w-md flex flex-col gap-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#307268] font-bold">Email:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#307268] font-bold">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    {...field}
                    className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Login Button */}
            <Button
              type="submit"
              className="bg-[#307268] text-white p-3 rounded-md w-full text-center"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* Forgot Password */}
        <div className="text-center">
        <Link href="/verify" className="text-sm text-[#307268] font-semibold hover:text-gray-800">
          Forgot Password?
        </Link>
        </div>
        

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="w-full max-w-md mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Password</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
