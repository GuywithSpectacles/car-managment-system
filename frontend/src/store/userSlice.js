import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    email: '',
    auth: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,

    //Define reducers and their actions 
    reducers: {
        setUser: (state, action) => {
            const { _id, email, auth } = action.payload;

            //Setting the state
            state._id = _id;
            state.email = email;
            state.auth = auth;
        },
        resetUser: (state) => {
            state._id = '';
            state.email = '';
            state.auth = false;
        },
    }
})

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;