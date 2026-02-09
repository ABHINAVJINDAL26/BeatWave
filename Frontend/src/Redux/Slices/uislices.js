import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        authModalOpen: false,
        authModalType: "login",
    },
    reducers: {
        openAuthModal: (state, action) => {
            state.authModalOpen = true;
            state.authModalType = action.payload;
        },

        closeAuthModal: (state, action) => {
            state.authModalOpen = false;
            state.authModalType = "login";
        },

        switchAuthMode: (state, action) => {
            state.authModalType = action.payload;
        },
    },
});

export const { openAuthModal, closeAuthModal, switchAuthMode } = uiSlice.actions;
export default uiSlice.reducer;