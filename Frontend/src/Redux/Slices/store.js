import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import uiReducer from "./uislices";

const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
    },
});

export default store;