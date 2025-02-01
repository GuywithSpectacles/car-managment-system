import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import { useSelector } from "react-redux"; // to read the state of the user
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await signout();
      dispatch(resetUser());
    } catch (err) {
      return err;
    }
  };
  return (
    <>
      <nav className={styles.navbar}>
        {isAuthenticated ? (
          <div>
            <NavLink
              to={"/"}
              className={`${styles.logo} ${styles.inActiveStyle}`}
            >
              Car Management System
            </NavLink>

            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              Dashboard
            </NavLink>
            <NavLink>
              <button className={styles.signOutButton} onClick={handleSignOut}>
                Sign Out
              </button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink
              to={"login"}
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.logInButton}>Log In</button>
            </NavLink>

            <NavLink
              to={"signup"}
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.signUpButton}>Sign Up</button>
            </NavLink>
          </div>
        )}
      </nav>
      <div className={styles.separator}></div>
    </>
  );
}

export default Navbar;
