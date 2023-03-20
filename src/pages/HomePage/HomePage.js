import React, { useEffect, useState, useContext } from "react";
import "./HomePage.module.css";
import { collection, doc, query, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Loader from "../../components/UI/Loader/Loader";
import AuthContext from "../../context/Auth/AuthContext";
// import { getAuth } from "firebase/auth";
// import { addDataToCollection } from "../../utils/AddProducts";

function HomePage() {
  const { setAuthUser } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    const productsRef = collection(db, "products");
    const productsSnapshot = await getDocs(query(productsRef));

    const productsData = productsSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    setProducts(productsData);
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setAuthUser(user);
    }
    getProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default HomePage;
