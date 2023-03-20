import React, { useRef, useContext, useEffect } from "react";
import AuthContext from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const { user, loading, error, message, login, clearError } =
    useContext(AuthContext);
  const isAuth = user;

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }

    if (error) {
      toast.error(message);
      clearError();
    }
  }, [error, user]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }

    await login(emailVal, passwordVal);
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input
          type="email"
          name="email"
          ref={emailRef}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          ref={passwordRef}
          placeholder="Enter Password"
        />
        <button>{loading ? "Loading" : "Sign In"}</button>
      </form>
    </div>
  );
};

export default LoginPage;
