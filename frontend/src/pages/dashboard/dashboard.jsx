import { useState, useEffect } from "react"
import { getCars } from "../../api/internal"
import styles from "./dashboard.module.css"

// Use the correct environment variable
const API_BASE_URL = process.env.REACT_APP_INTERNAL_API_PATH

function Dashboard() {
  const [cars, setCars] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 10 // Items per page

  useEffect(() => {
    const fetchCars = async () => {
      const response = await getCars(page, limit)
      if (response?.data) {
        setCars(response.data.cars)
        setTotal(response.data.total)
      }
    }
    fetchCars()

    return () => setCars([])
  }, [page])

  return (
    <>
      <div className={styles.dashboardHeader}>Registered Cars: {total}</div>
      <div className={styles.grid}>
        {cars.map((car) => (
          <div key={car._id} className={styles.card}>
            <img
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
    </>
  )
}

export default Dashboard

