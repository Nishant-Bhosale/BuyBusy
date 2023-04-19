import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer.js";
import productsReducer from "../reducers/productsReducer.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
