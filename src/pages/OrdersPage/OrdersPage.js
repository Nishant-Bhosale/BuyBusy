import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { getProductsUsingProductIds } from "../../utils/utils";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./OrdersPage.module.css";
import { toast } from "react-toastify";
import OrderTable from "../../components/OrderTable/OrderTable";
import { getUser } from "../../redux/reducers/authReducer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector(getUser);

  // Fetch user orders from firestore
  const getOrders = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "userOrders", user.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      // Display error message if no orders found
      if (!data) {
        return toast.error("No Orders Found!");
      }

      // Array to store promises
      let promiseArray = [];

      // For each order call the getProductsUsingProductIds() and store the promise in the array
      data.orders.forEach((order) => {
        promiseArray.push(
          new Promise((resolve, reject) => {
            const data = getProductsUsingProductIds(order);
            if (data) resolve(data);
            else reject("Something went wrong");
          })
        );
      });

      // Resolve all promises and store them in the final orders array
      const finalOrders = await Promise.all(promiseArray);
      console.log(finalOrders);
      setOrders(finalOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!loading && !orders.length)
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, idx) => {
        return <OrderTable order={order} key={idx} />;
      })}
    </div>
  );
};

export default OrdersPage;
