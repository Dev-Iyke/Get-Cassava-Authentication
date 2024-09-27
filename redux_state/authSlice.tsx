import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

//A single user details for authentication purposes
interface User {
    id: string;
    name: string;
    email: string;
    loginToken: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    verifiedToken: string;
    verifiedEmail: string;

}

//initial state to be overwritten by the AuthState while in use
const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    verifiedToken: '',
    verifiedEmail: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut (state) {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.verifiedToken = '';
            state.verifiedEmail = '';
        },
        setVerificationDetails(state, action) {
          state.verifiedEmail = action.payload.email;
          state.verifiedToken = action.payload.token;
           
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(verifyUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            console.log('verification pending...')
        })
        .addCase(verifyUser.fulfilled, (state, action) => {
          state.loading = false;
          console.log('verification successful: ', action.payload)
        })
        .addCase(verifyUser.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload as string || 'An error occurred during verification';
            console.error("Verification failed:", action.payload);
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            console.log('registration pending...')
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          const userData = action.payload.data;
          state.loading = false;
          if(state.user){
            state.user.id = userData.userId;
            state.user.name = userData.firstName + ' ' + userData.lastName,
            state.user.email = userData.email,
            state.user.loginToken = userData.token;
          }else{
            state.user = {
              id: userData.userId,
              name: userData.firstName + ' ' + userData.lastName,
              email: userData.email,
              loginToken: userData.token
            }
          }         
          console.log('Registration successful:', action.payload)          
          console.log(state.user)
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'An error occurred during registration';
            console.error('Registration failed: ', action.payload)
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            console.log('Login pending...')
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          const userData = action.payload.data;
          state.loading = false;
          if(state.user){
            state.user.id = userData.userId;
            state.user.name = userData.firstName + '' + userData.lastName,
              state.user.email = userData.email,
            state.user.loginToken = userData.token;
          }else{
            state.user = {
              id: userData.userId,
              name: userData.firstName + ' ' + userData.lastName,
              email: userData.email,
              loginToken: userData.token
            }
          } 
            console.log("Login successful:", action.payload);
          
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'An error occurred during login';
            console.error("Login failed: ", action.payload);
        })
        
        
    },


})

//Sending verification request to the server
export const verifyUser = createAsyncThunk('auth/verifyUser', async (verificationData: {email: string, url:string}, {rejectWithValue}) => {
  try{
    const response = await fetch('https://getcassava.onrender.com/api/auth/verify', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(verificationData)
    })
    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'verification failed');
    }
    const data = await response.json()     
    return data;

  }catch(e: any){
    return rejectWithValue(e.message)
  }
}) 


//Sending registration request to the server
export const registerUser = createAsyncThunk('auth/registerUser', async (registrationData: {
    firstName: string,
    lastName: string,
    password: string,
    location: string,
    role: string,
    farmDetails: {
        farmLocation: string,
        farmName: string,
        cropTypes: []
    },
    email: string,
    token: string
}, {rejectWithValue}) => {
    const {email, token, ...requiredRegData} = registrationData
    try{
        const response = await fetch(`https://getcassava.onrender.com/api/auth/signup?email=${email}&token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requiredRegData)
        })
        if (!response.ok) {
          const errorData = await response.json()
          return rejectWithValue(errorData.message || 'sign up failed');
          }
        const data = await response.json()
        console.log(data);
        return data;

    }catch(e: any){
      console.error("Registration error: ", e);  // Log the error for debugging purposes.
      return rejectWithValue(e.message)
    }
}) 

//Sending login request to the server
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData: {email: string, password: string}, {rejectWithValue}) => {
    try{
        const response = await fetch('https://getcassava.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          return rejectWithValue(errorData.message || 'Login failed');
        }

        const data = await response.json()
        return data;

    }catch(e: any){
      console.error("Login error: ", e);  // Log the error for debugging purposes.
      return rejectWithValue(e.message)
    }

}) 



export const {logOut, setVerificationDetails} = authSlice.actions
export default authSlice.reducer