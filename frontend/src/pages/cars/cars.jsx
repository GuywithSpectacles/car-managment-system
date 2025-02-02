import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import styles from "./cars.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_INTERNAL_API_PATH;

function Cars() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const isAuthenticated = useSelector((state) => state.user.auth);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData._id);
  }, []);

  const [formData, setFormData] = useState({
    categoryId: "",
    model: "",
    make: "",
    year: "",
    color: "",
    registrationNo: "",
    description: "",
    ownerId: "",
    image: null,
    carId: "",
  });

  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sortBy] = useState("createdAt:desc");

  // Fetch all cars

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get-all-cars`, {
        params: { page, limit, sortBy },
        withCredentials: true,
      });
      setCars(response.data.cars);
      setTotalRows(response.data.total);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy]); // Dependencies for fetchCars
  
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-all-categories`, {
        withCredentials: true,
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []); // No dependencies for fetchCategories
  
  useEffect(() => {
    fetchCars();
    fetchCategories();
  }, [fetchCars, fetchCategories]); // Include both functions in the dependency array

  // Handle form input change
  const handleInputChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] }); 
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Add or Update Car
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData(); // Create FormData object
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("make", formData.make);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("registrationNo", formData.registrationNo);
      formDataToSend.append("description", formData.description);
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      } else if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (editId) {
        formDataToSend.append("carId", editId); // Append the car ID for update
      } else {
        formDataToSend.append("ownerId", user);
      }

      if (editId) {
        // Update car
        await axios.put(`${API_BASE_URL}/update-car`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        // Create car
        await axios.post(`${API_BASE_URL}/create-car`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }
      fetchCars(); // Refresh the list
      setFormData({
        categoryId: "",
        model: "",
        make: "",
        year: "",
        color: "",
        registrationNo: "",
        description: "",
        ownerId: "",
        image: null,
      });
      setEditId(null);
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

 // Handle car deletion
 const handleDelete = async (carId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this car?");
    if (isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/delete-car/${carId}`, {
          withCredentials: true,
        });
        fetchCars(); // Refresh the list
        alert("Car deleted successfully!");
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Failed to delete car. Please try again.");
      }
    } else {
      console.log("Deletion canceled by user.");
    }
  };

  // Edit Car
  const handleEdit = async (car) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-car/${car._id}`, {
        withCredentials: true,
      });

      const carData = response.data.data;
      setFormData({
        categoryId: carData.categoryId,
        model: carData.model,
        make: carData.make,
        year: carData.year,
        color: carData.color,
        registrationNo: carData.registrationNo,
        description: carData.description,
        ownerId: carData.ownerId,
        image: carData.image,
        carId: carData._id,
      });
      setEditId(carData._id);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setPage(page);
  };

  // Handle per page change
  const handlePerRowsChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
  };

  // DataTable columns
  const columns = [
    { name: "Make", selector: (row) => row.make, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Color", selector: (row) => row.color, sortable: true },
    {
      name: "Registration No",
      selector: (row) => row.registrationNo,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`${row.image}`} // Display the image
          alt="Car"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button className={styles.editButton} onClick={() => handleEdit(row)}>
            Edit
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Cars Management</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="make"
          placeholder="Make"
          value={formData.make}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="registrationNo"
          placeholder="Registration No"
          value={formData.registrationNo}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
        />
        

        <input
          type="text"
          name="ownerId"
          value={user}
          hidden
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editId ? "Update Car" : "Add Car"}</button>
      </form>
      <DataTable
        columns={columns}
        data={cars}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        progressPending={isLoading}
        noDataComponent="No cars found."
        className={styles.dataTable}
      />
    </div>
  );
}

export default Cars;
