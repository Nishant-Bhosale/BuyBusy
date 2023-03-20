import React, { useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";

const RegisterPage = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  const { user, loading, error, message, signup, clearError } =
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
    const nameVal = nameRef.current.value;
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    if (
      emailVal === "" ||
      nameVal === "" ||
      passwordVal === "" ||
      passwordVal.length < 6
    ) {
      return toast.error("Please enter valid data!");
    }

    await signup({ name: nameVal, email: emailVal, password: passwordVal });
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input type="text" name="name" ref={nameRef} placeholder="Enter Name" />
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
        <button>{loading ? "Loading" : "Sign Up"}</button>
      </form>
    </div>
  );
};

export default RegisterPage;
