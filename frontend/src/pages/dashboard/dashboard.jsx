import { useState, useEffect } from "react";
import { getCars } from "../../api/internal";
import styles from "./dashboard.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_INTERNAL_API_PATH;

function Dashboard() {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const limit = 10;
  const isAuthenticated = useSelector((state) => state.user.auth); 

  useEffect(() => {
    const fetchCars = async () => {
      const response = await getCars(page, limit);
      if (response?.data) {
        setCars(response.data.cars);
        setTotal(response.data.total);
      }
    };
    fetchCars();

    return () => setCars([]);
  }, [page]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const CarDetailsPopup = ({ car, onClose }) => {
    if (!car) return null;

    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContent}>
          <h2>Car Details</h2>
          <table>
            <tbody>
              <tr>
                <th>Make</th>
                <td>{car.make}</td>
              </tr>
              <tr>
                <th>Model</th>
                <td>{car.model}</td>
              </tr>
              <tr>
                <th>Year</th>
                <td>{car.year}</td>
              </tr>
              <tr>
                <th>Color</th>
                <td>{car.color}</td>
              </tr>
              <tr>
                <th>Registration No</th>
                <td>{car.registrationNo}</td>
              </tr>
              <tr>
                <th>Image</th>
                <td>
                  <img
                    width={100}
                    height={100}
                    src={car.image.startsWith("http") ? car.image : `${API_BASE_URL}${car.image}`}
                    alt={`${car.make} ${car.model}`}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardMain}>
        <div className={styles.dashboardHeader}>
          <h1>Registered Cars: {total}</h1>
        </div>
        <div className={styles.dashboardCards}>
          {cars.map((car) => (
            <div key={car._id} className={styles.card} onClick={() => setSelectedCar(car)}>
              <img
                width={200}
                height={200}
                src={car.image.startsWith("http") ? car.image : `${API_BASE_URL}${car.image}`}
                alt={`${car.make} ${car.model}`}
              />
              <h3>
                {car.make} {car.model}
              </h3>
              <p>
                {car.year} | {car.color}
              </p>
              <p>Reg: {car.registrationNo}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedCar && <CarDetailsPopup car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
}

export default Dashboard;