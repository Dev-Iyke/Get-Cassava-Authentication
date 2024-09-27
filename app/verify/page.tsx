"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifyUser } from '@/redux_state/authSlice';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux_state/store';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as z from "zod";

// Form schema
const formSchema = z.object({
  email: z.string().email(),
});

export default function SignUp() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const error = useSelector((state: RootState) => state.auth.error);

  const url = 'http://localhost:3000/verification/';

  const handleVerification = (values: z.infer<typeof formSchema>) => {
    const { email } = values;
    router.push('/');
    dispatch(verifyUser({ email, url }));
  };

  useEffect(() => {
    document.title = "Get Cassava - Verify User";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg p-8 my-12 bg-white shadow-lg rounded-lg">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/auth-img/auth-logo.png"
            alt="Get Cassava Logo"
            className="mx-auto h-16 w-16"
            width={64} height={64}
          />
        </div>
        {/* Welcome message */}
        <h2 className="text-xl font-bold text-black mb-2 text-center">Welcome to Getcassava</h2>
        <p className="text-gray-600 mb-6 text-base text-center">
          Type your e-mail or phone number to log in or create a Getcassava account.
        </p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerification)} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-[#307268]">
                  Email:
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button
              type="submit"
              className="bg-[#307268] text-white p-3 rounded-md w-full text-center"
            >
              Continue
            </Button>
          </form>
        </Form>

        {/* Error message */}
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        {/* Policy and Rules */}
        <p className="mt-6 text-gray-500 text-xs">
          By continuing you agree to the <span className="font-semibold text-gray-700">Policy and Rules</span>
        </p>
      </div>
    </div>
  );
}
