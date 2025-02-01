import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Dashboard from "./pages/dashboard/dashboard";
import styles from "./App.module.css";
import Protected from "./components/protected/protected";
import Error from "./pages/error/error";
import Login from "./pages/login/login";
import { useSelector } from "react-redux";
import Signup from "./pages/signup/signup";

import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";



function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    /* <> is a react fragment, to return only one component */
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
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
      </BrowserRouter>
    </div>
  );
}

export default App;
