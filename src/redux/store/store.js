import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer.js";
import productsReducer from "../reducers/productsReducer.js";
import cartReducer from "../reducers/cartReducer.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
