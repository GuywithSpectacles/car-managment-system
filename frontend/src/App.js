import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Dashboard from "./pages/dashboard/dashboard";
import styles from "./App.module.css";
import Error from "./pages/error/error";
import Login from "./pages/login/login";
import { useSelector } from "react-redux";
import Signup from "./pages/signup/signup";

import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import Cars from "./pages/cars/cars";
import Categories from "./pages/categories/categories";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <div className={styles.content}>
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <div className={styles.main}>
                    <Dashboard />
                  </div>
                }
              />
              <Route
                path="login"
                exact
                element={
                  <div className={styles.main}>
                    <Login />
                  </div>
                }
              />
              <Route
                path="signup"
                exact
                element={
                  <div className={styles.main}>
                    <Signup />
                  </div>
                }
              />
              <Route path="/cars" exact element={
                <div className={styles.main}>


                  <Cars />
                </div>
              } />
               <Route path="/categories" exact element={
                <div className={styles.main}>


                  <Categories />
                </div>
              } />

              <Route
                path="*"
                exact
                element={
                  <div className={styles.main}>
                    <Error />
                  </div>
                }
              />
            </Routes>
          <Footer />

          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;