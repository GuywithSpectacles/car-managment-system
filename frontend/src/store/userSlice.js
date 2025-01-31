import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    userName: '',
    email: '',
    auth: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,

    //Define reducers and their actions 
    reducers: {
        setUser: (state, action) => {
            const { _id, userName, email, auth } = action.payload;

            //Setting the state
            state._id = _id;
            state.userName = userName;
            state.email = email;
            state.auth = auth;
        },
        resetUser: (state) => {
            state._id = '';
            state.userName = '';
            state.email = '';
            state.auth = false;
        },
    }
})

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;