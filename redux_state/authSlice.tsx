import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//A single user details for authentication purposes
interface User {
    id: string;
    name: string;
    email: string;
    //isFarmer: boolean;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    verifiedToken: string | null;
    verifiedEmail: string | null;

}

//initial state to be overwritten by the AuthState while in use
const initialState = {
    user: null,
    loading: false,
    error: null,
    verifiedToken: null,
    verifiedEmail: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut (state) {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.verifiedToken = null;
            state.verifiedEmail = null;
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
        })
        .addCase(verifyUser.fulfilled, (state, action) => {
            state.loading = true;
            state.user = action.payload.user
        })
        .addCase(verifyUser.rejected, (state) => {
            state.loading = false;
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = true;
            state.user = action.payload.user
        })
        .addCase(registerUser.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = true;
            state.user = action.payload.user
        })
        .addCase(loginUser.rejected, (state) => {
            state.loading = false;
        })
        
        
    },


})

//Sending verification request to the server
export const verifyUser = createAsyncThunk('auth/verifyUser', async (verificationData: {email: string}, {rejectWithValue}) => {
    try{
        const response = await fetch('https://getcassava.onrender.com/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(verificationData)
        })
        if (!response.ok) {
            throw new Error('verification failed');
          }
        const data = await response.json()     
        return data;

    }catch(e: any){
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
            throw new Error('Login failed');
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
        const response = await fetch(`https://getcassava.onrender.com/api/auth/signup?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requiredRegData)
        })
        if (!response.ok) {
            throw new Error('sign up failed');
          }
        const data = await response.json()
        return data;

    }catch(e: any){
        return rejectWithValue(e.message)
    }

}) 

export const {logOut, setVerificationDetails} = authSlice.actions

export default authSlice.reducer