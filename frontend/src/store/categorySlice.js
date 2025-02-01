import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    name: ''
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,

    //Define reducers and their actions 
    reducers: {
        setCategory: (state, action) => {
            const { _id, name } = action.payload;

            state._id = action.payload._id;
            state.name = action.payload.name;
        },

        resetCategory: (state) => {
            state._id = '';
            state.name = '';
        }
    }
})

export const { setCategory, resetCategory } = categorySlice.actions;
export default categorySlice.reducer;