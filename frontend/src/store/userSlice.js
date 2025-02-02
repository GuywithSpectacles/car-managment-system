import { createSlice } from "@reduxjs/toolkit";

// Helper function to save user state to localStorage
const saveUserToLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to load user state from localStorage
const loadUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : { _id: '', email: '', auth: false };
};

// Initialize state from localStorage
const initialState = loadUserFromLocalStorage();

export const userSlice = createSlice({
    name: 'user',
    initialState,

    // Define reducers and their actions
    reducers: {
        setUser: (state, action) => {
            const { _id, email, auth } = action.payload;

            // Update the state
            state._id = _id;
            state.email = email;
            state.auth = auth;

            // Save the updated state to localStorage
            saveUserToLocalStorage(state);
        },
        resetUser: (state) => {
            // Reset the state
            state._id = '';
            state.email = '';
            state.auth = false;

            // Clear the user data from localStorage
            localStorage.removeItem('user');
        },
    }
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;