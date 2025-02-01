import yup from "yup";

export const categorySchema = yup.object().shape({
    name: yup.string().max(50).required('Category name is required'),
});