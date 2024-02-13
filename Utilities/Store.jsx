import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './authSlice'
import { socketReducer } from "./socketSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export default store