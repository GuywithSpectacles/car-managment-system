import { useState, useEffect } from "react";
import { 
    getCategories, 
    deleteCategory, 
    createCategory, 
    updateCategory 
} from "../../api/internal";


function Category() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            if (response?.data) {
                setCategories(response.data);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        $("#categoriesTable").DataTable();
    }, [categories]);

    return (
        <>
        
        </>
    )

}