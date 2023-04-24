import React, { useEffect } from "react";
import Loader from "../../components/UI/Loader/Loader";
import ProductList from "../../components/Product/ProductList/ProductList";
import styles from "./CartPage.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../redux/reducers/authReducer";
import {
  fetchCartProducts,
  getCartLoadingState,
  getCartProducts,
  clearUserCart,
  getPurchasingState,
  purchaseProducts,
} from "../../redux/reducers/cartReducer";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartProducts = useSelector(getCartProducts);
  const loading = useSelector(getCartLoadingState);
  const user = useSelector(getUser);
  const purchasing = useSelector(getPurchasingState);

  // Calculate total price of the products in cart
  let totalPrice = cartProducts?.reduce((acc, currentProduct) => {
    return acc + currentProduct.price * currentProduct.quantity;
  }, 0);

  useEffect(() => {
    dispatch(fetchCartProducts({ uid: user?.uid }));
  }, []);

  const purchaseProductsHandler = async () => {
    try {
      await dispatch(purchaseProducts({ uid: user?.uid }));
      // Redirect the user to orders page after successful purchase
      clearUserCartAndRedirectToOrdersPage();
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  // Clear user cart
  const clearUserCartAndRedirectToOrdersPage = async () => {
    await dispatch(clearUserCart({ uid: user?.uid }));
    navigate("/myorders");
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {!!cartProducts?.length && (
        <aside className={styles.totalPrice}>
          <p>TotalPrice:- ₹{totalPrice}/-</p>
          <button
            className={styles.purchaseBtn}
            onClick={purchaseProductsHandler}
          >
            {purchasing ? "Purchasing" : "Purchase"}
          </button>
        </aside>
      )}
      {!!cartProducts?.length ? (
        <ProductList products={cartProducts} onCart />
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
