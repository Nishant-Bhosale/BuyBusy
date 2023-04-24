import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  getProductsUsingProductIds,
  getUserCartProducts,
} from "../../utils/utils";

const initialState = {
  cartProducts: [],
  cartProductsMap: {},
  purchasing: false,
  loading: false,
};

export const fetchCartProducts = createAsyncThunk(
  "cart/fetch",
  async ({ uid }) => {
    const { data } = await getUserCartProducts(uid);

    const { myCart: cart } = data;

    const productsData = await getProductsUsingProductIds(cart);
    if (!productsData) {
      toast.error("No products in Cart!");
      return productsData;
    }

    return { cart, productsData };
  }
);

// Remove product from the database
export const removeProductFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, uid }) => {
    const { data, docRef } = await getUserCartProducts(uid);

    const { myCart: cart } = data;

    if (!cart[productId]) {
      toast.error("Product not in cart!");
      return;
    }

    delete cart[productId];

    await updateDoc(docRef, {
      myCart: {
        ...cart,
      },
    });

    return { productId };
  }
);

export const purchaseProducts = createAsyncThunk(
  "cart/purchase",
  async ({ uid }, { getState }) => {
    const state = getState();
    const docRef = doc(db, "userOrders", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    // If users orders exist add a new order to the orders list
    if (data) {
      console.log(state);
      return await updateDoc(docRef, {
        orders: arrayUnion({ ...state.cart.cartProductsMap, date: Date.now() }),
      });
    }

    // Create a new orders array if no orders yet
    return await setDoc(docRef, {
      orders: [{ ...state.cart.cartProductsMap, date: Date.now() }],
    });
  }
);

export const clearUserCart = createAsyncThunk("cart/clear", async ({ uid }) => {
  const userCartRef = doc(db, "usersCarts", uid);
  return await updateDoc(userCartRef, {
    myCart: {},
  });
});

// Remove product from cart and cart products list
const deleteProductFromCart = (state, action) => {
  const { productId } = action.payload;

  delete state.cartProductsMap[productId];

  state.cartProducts = state.cartProducts.filter((product) => {
    return product.id !== productId;
  });
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateProductQuantity(state, action) {
      const { id, type } = action.payload;

      let tempCart = state.cartProducts.map((product) => {
        if (product.id === id) {
          product.quantity += type === "add" ? 1 : -1;
        }
        return product;
      });

      state.cartProductsMap[id] += type === "add" ? 1 : -1;

      state.cartProducts = tempCart;
    },
    filterProductFromCart: deleteProductFromCart,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCartProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.loading = false;

        const { cart, productsData } = action.payload;

        state.cartProductsMap = cart;
        state.cartProducts = productsData;
      })
      .addCase(fetchCartProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.cartProducts = [];
        state.cartProductsMap = {};
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        deleteProductFromCart(state, action);
        toast.success("Product Removed Successfully!");
      })
      .addCase(purchaseProducts.pending, (state) => {
        state.purchasing = true;
      })
      .addCase(purchaseProducts.fulfilled, (state) => {
        state.purchasing = false;
      })
      .addCase(purchaseProducts.rejected, (state) => {
        state.purchasing = false;
      });
  },
});

export const getCartLoadingState = (state) => state.cart.loading;
export const getCartProducts = (state) => state.cart.cartProducts;
export const getCartProductsMap = (state) => state.cart.cartProductsMap;
export const getPurchasingState = (state) => state.cart.purchasing;

export const { updateProductQuantity, filterProductFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
