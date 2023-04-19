import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import CartPage from "./pages/CartPage/CartPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAuthUser } from "./redux/reducers/authReducer";

function App() {
  const auth = getAuth();
  const dispatch = useDispatch();

  // Authenticate the user if he is already logged in and set the user in the auth context.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setAuthUser({ user }));
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header>
        <Navbar />
      </header>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/signup" exact element={<RegisterPage />} />
        <Route path="/signin" exact element={<LoginPage />} />
        <Route path="/cart" exact element={<CartPage />} />
        <Route path="/myorders" exact element={<OrdersPage />} />
        {/* NotFoundPage would be rendered if an invalid route is tried to access */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
