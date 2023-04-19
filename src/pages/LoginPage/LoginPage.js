import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getError,
  getErrorMessage,
  getLoadingState,
  getUser,
} from "../../redux/reducers/authReducer";
import { clearError, login } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const user = useSelector(getUser);
  const error = useSelector(getError);
  const message = useSelector(getErrorMessage);
  const loading = useSelector(getLoadingState);

  const isAuth = user;

  useEffect(() => {
    // If user is authenticated redirect him to home page
    if (isAuth) {
      navigate("/");
    }

    // If some error occurs display the error
    if (error) {
      toast.error(message);
      dispatch(clearError());
    }
  }, [error, user]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }

    dispatch(login({ email: emailVal, password: passwordVal }));
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          ref={emailRef}
          className={styles.loginInput}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          ref={passwordRef}
          className={styles.loginInput}
          placeholder="Enter Password"
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
    </div>
  );
};

export default LoginPage;
