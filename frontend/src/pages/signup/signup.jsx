import { useState } from "react";
import styles from "./signup.module.css";
import TextInput from "../../components/textInput/textInput";
import { signupSchema } from "../../schemas/signupSchema";
import { useFormik } from "formik"; //for form validation
import { signup } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux"; // Coz we need to Write the state
import { useNavigate } from "react-router-dom";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const data = {
        name: values.name,
        email: values.email,
      };
      const response = await signup(data);
      if (response.status === 201) {
        const user = {
          _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          auth: response.data.auth,
        };
        dispatch(setUser(user));
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        setError(error.response.data.message);
      } else {
        // Network error or no response
        setError("An unexpected error occurred");
      }
    }
  };

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: {
      name: "",
      email: ""
    },
    validationSchema: signupSchema,
    onSubmit: handleSignup,
  });

  return (
    <div className={styles.signupWapper}>
      <div className={styles.signupHeader}>Create an Account</div>

      <TextInput
        label="Name"
        name="name"
        type="text"
        value={values.name}
        onChange={handleChange}
        placeholder="Name"
        onBlur={handleBlur}
        error={touched.name && errors.name ? 1 : undefined}
        errormessage={errors.name}
      />

      <TextInput
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
        onBlur={handleBlur}
        error={touched.email && errors.email ? 1 : undefined}
        errormessage={errors.email}
      />

      <button
        type="submit"
        className={styles.signupButton}
        onClick={handleSignup}
        disabled={
          !values.email || 
          !values.name ||
          errors.email || 
          errors.name
        }
      >
        Signup
      </button>
      <span>
        Already have an account?{" "}
        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}

export default Signup;
