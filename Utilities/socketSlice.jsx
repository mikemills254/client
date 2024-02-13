import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isConnected: localStorage.getItem("socket_id") ? true : false,
    socket: null
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        connectSuccess(state, action) {
            state.isConnected = true;
            state.socket = action.payload;
        },
        disconnect(state) {
            state.isConnected = false;
            state.socket = null;
        },
        connectFailure(state) {
            state.isConnected = false;
            state.socket = null;
        }
    }
});

export const { connectSuccess, disconnect, connectFailure } = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
export const selectSocket = state => state.socket;
