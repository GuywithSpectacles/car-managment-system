import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import { useSelector } from "react-redux";
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
    <div className={styles.sidebar}>
      <NavLink to={"/"} className={styles.logo}>
        Car Management System
      </NavLink>
      {isAuthenticated ? (
        <>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to={"/cars"}
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Cars
          </NavLink>
          <NavLink
            to={"/categories"}
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Categories
          </NavLink>
          <button className={styles.signOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Navbar;