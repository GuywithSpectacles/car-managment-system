//Central store for our application
//This is where we will store our states
import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";

const store = configureStore({
    reducer: { user }
});

export default store;