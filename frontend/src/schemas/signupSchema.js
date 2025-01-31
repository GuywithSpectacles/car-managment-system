import * as yup from "yup";

export const signupSchema = yup.object().shape({
    name: yup.string().max(30).required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
});

export default signupSchema;