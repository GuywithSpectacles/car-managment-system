//Central store for our application
//This is where we will store our states
import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import category from "./categorySlice";

const store = configureStore({
    reducer: { user, category }

});

export default store;