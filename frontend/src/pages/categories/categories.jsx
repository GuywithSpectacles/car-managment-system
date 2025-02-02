import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import styles from "./categories.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_INTERNAL_API_PATH;

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.auth); 

  // Fetch all categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
    const response = await axios.get(`${API_BASE_URL}/get-all-categories`, { withCredentials: true });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update category
        await axios.put(`${API_BASE_URL}/update-category`, 
        {
          categoryId: editId,
          name: formData.name,
        }, 
        { withCredentials: true });
      } else {
        // Create category
        await axios.post(`${API_BASE_URL}/create-category`, formData, { withCredentials: true });
      }
      fetchCategories(); // Refresh the list
      setFormData({ name: "" }); // Reset form
      setEditId(null); // Clear edit mode
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Delete Category
  const handleDelete = async (categoryId) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this category?");
    
    if (isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/delete-category/${categoryId}`, {
          withCredentials: true,
        });
        fetchCategories(); // Refresh the list
        alert("Category deleted successfully!");  
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again."); 
      }
    } else {
      console.log("Deletion canceled by user.");
    }
  };

  // Edit Category
  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditId(category._id);
  };

  // DataTable columns
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    {
      name: "Actions",
      
      cell: (row) => (
        <>
          <button className={styles.editButton} onClick={() => handleEdit(row)}>
            Edit
          </button>
          <button className={styles.deleteButton} onClick={() => handleDelete(row._id)}>
            Delete
          </button>
        </>
      ),
    },
  ];
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div className={styles.container}>
      <h2>Categories Management</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editId ? "Update Category" : "Add Category"}</button>
      </form>
      <DataTable
        columns={columns}
        data={categories}
        pagination
        progressPending={isLoading}
        noDataComponent="No categories found."
      />
    </div>
  );
}

export default Categories;