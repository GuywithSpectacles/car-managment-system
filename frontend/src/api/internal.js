// to handle api calls from the backend
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API_PATH,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (data) => {
    let response;
    try{
        response = await api.post("/login", data);
    }
    catch(err){
        return err;
    }
    return response; 
}

export const signup = async (data) => {
    let response;
    try{
        response = await api.post("/register", data);
    }
    catch(err){
        return err;
    }
    return response; 
}

export const signout = async () => {
    let response;
    try{
        response = await api.post("/logout");
    }
    catch(err){
        return err;
    }
    return response; 
}

export const getCategories = async () => {
    let response;
    try {
        response = await api.get("/get-all-categories");
        
        
    } catch (err) {
        
        return err;
    }
    return response;
};

export const createCategory = async (data) => {
    let response;
    try {
        response = await api.post("/create-category", data);
    } catch (err) {
        return err;
    }
    return response;
};

export const updateCategory = async (id, data) => {
    let response;
    try {
        response = await api.put(`/update-category/${id}`, data);
    } catch (err) {
        return err;
    }
    return response;
};

export const deleteCategory = async (id) => {
    let response;
    try {
        response = await api.delete(`/delete-category/${id}`);
    } catch (err) {
        return err;
    }
    return response;
};

export const getCars = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/get-all-cars?page=${page}&limit=${limit}&sortBy=createdAt:desc`);
        return response;
    } catch (err) {
        console.error("Error fetching cars:", err);
        return null;
    }
};

export default api;