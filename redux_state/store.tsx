import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";



//Defining persist configuration for auth slice
const persistConfig = {
    key: 'userAuth',
    storage, //: window.localStorage
}

//Creating the root reducer
const rootReducer = combineReducers({
    auth: authReducer
})

//Creating persisted auth slice reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Creating store
const store = configureStore({
    reducer: persistedReducer
});

// persisting and rehydrating the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store