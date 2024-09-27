"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/redux_state/authSlice";
import { AppDispatch, RootState } from "@/redux_state/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";

// form schema
const formSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    location: z.string(),
    role: z.enum(["Farmer", "Buyer"]),
    farmLocation: z.string(),
    farmName: z.string(),
    cropType: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "Farmer") {
      return !!data.farmLocation;
    }
    return true;
  }, {
    message: "Please provide a farm location",
    path: ["farmLocation"],
  })
  .refine((data) => {
    if (data.role === "Farmer") {
      return !!data.farmName;
    }
    return true;
  }, {
    message: "Please provide a farm name",
    path: ["farmName"],
  })
  .refine((data) => {
    if (data.role === "Farmer") {
      return !!data.cropType;
    }
    return true;
  }, {
    message: "Please provide a list of crop types",
    path: ["cropType"],
  });

  export default function SignUp() {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const userToken = useSelector((state: RootState) => state.auth.verifiedToken);
    const userEmail = useSelector((state: RootState) => state.auth.verifiedEmail);
    // const error = useSelector((state: RootState) => state.auth.error);
    const {user, error} = useSelector((state: RootState) => state.auth)
  
    const cropTypes: string[] = [];
  
    const handleRegistration = async (values: z.infer<typeof formSchema>) => {
      console.log({ values });
      const { firstName, lastName, password, location, role, farmLocation, farmName, cropType } = values;
  
      cropType.trim().split(',').forEach((crop) => cropTypes.push(crop));
  
      await dispatch(
        registerUser({
          firstName,
          lastName,
          password,
          location,
          role,
          farmDetails: { farmLocation, farmName, cropTypes },
          email: userEmail,
          token: userToken,
        })
      );
      if (user){
        router.push('/dashboard')
      }
    };
  
    useEffect(() => {
      document.title = "Get Cassava - Sign up";
    }, []);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: userEmail,
        firstName: '',
        lastName: '',
        location: '',
        password: '',
        confirmPassword: '',
        farmLocation: '',
        farmName: '',
        cropType: '',
      },
    });
    const userRole = form.watch('role');
  
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg p-8 my-12 bg-white shadow-lg rounded-lg space-y-4">
        <div className="mb-6">
          <img
            src="/auth-img/auth-logo.png"
            alt="Get Cassava Logo"
            className="mx-auto h-16 w-16"
            width={64} height={64}
          />
        </div>
          <h2 className="text-center text-2xl font-bold text-black">Sign up with Get Cassava</h2>
          <p className="text-black text-center">Let&apos;s get started by creating your account. To keep your account safe, we need a strong password</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">Email Address:</FormLabel>
                    <FormControl>
                      <Input
                      disabled
                        placeholder="Your Email"
                        type="email"
                        {...field}
                        readOnly
                        className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">First Name:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your first name"
                        {...field}
                        className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">Last Name:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your last name"
                        {...field}
                        className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">Location:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your location"
                        {...field}
                        className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">Role:</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent">
                          <SelectValue placeholder="What are you here as" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Farmer">A Farmer</SelectItem>
                        <SelectItem value="Buyer">A Buyer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {userRole === 'Farmer' && (
                <>
                  <FormField
                    control={form.control}
                    name="farmLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#307268] font-bold">Farm Location:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your farm location"
                            {...field}
                            className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <FormField
                    control={form.control}
                    name="farmName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#307268] font-bold">Farm Name:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your farm name"
                            {...field}
                            className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#307268] font-bold">Crop types:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your farm crops"
                            {...field}
                            className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
  
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">Password:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Password"
                        type="password"
                        {...field}
                        className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#307268] font-bold">Confirm Password:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="confirm password"
                        type="password"
                        {...field}
                        className="w-full h-12 px-4 bg-[#F2F4F7] rounded-md focus:ring-2 focus:ring-[#307268] focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <Button
                type="submit"
                className="bg-[#307268] text-white p-3 rounded-md w-full text-center"
              >
                Submit
              </Button>
            </form>
          </Form>
  
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid password</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    );
  }
  