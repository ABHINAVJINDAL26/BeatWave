import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // set loading state during api calls(login, register, fetchuser)
        setLoading: (state, action) => {
            state.isLoading = action.payload;
            state.error = null;
        },

        setuser : (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            if(action.payload.token) {
                localStorage.setItem("token", action.payload.token);

            }
        },

        setError: (state, action) => {
            state.error = action.payload;
            // state.isAuthenticated = false;
            state.isLoading = false;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            // state.isLoading = false;
            state.error = null;
            localStorage.removeItem("token");
        },

        updateFavoriteSongs: (state, action) => {
            if (state.user) {
                state.user.favoriteSongs = action.payload;
            }
        },

        clearError: (state) => {
            state.error = null;
        }
    },
});

export const { setLoading, setuser, setError, logout, updateFavoriteSongs, clearError } = authSlice.actions;

export default authSlice.reducer;