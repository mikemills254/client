import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: localStorage.getItem("access_token") ? true : false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem("access_token", action.payload.token)
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("access_token")
        },
        signup(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.data;
            localStorage.setItem("access_token", action.payload.token)
        },
        failed(state) {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("access_token")
        }
    }
});

export const { login, logout, signup, failed } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectAuth = state => state.auth;