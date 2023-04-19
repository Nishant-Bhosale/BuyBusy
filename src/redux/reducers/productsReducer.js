import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const initialState = {
  loading: false,
  products: [],
  filteredProducts: [],
  error: "",
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    const productsRef = collection(db, "products");
    return await getDocs(query(productsRef));
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    filterProducts(state, action) {
      const {
        searchQuery,
        priceRange,
        categories: { mensFashion, womensFashion, jewelery, electronics },
      } = action.payload;

      let filteredProducts = state.products;
      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) => {
          return product.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        });
      }
      if (mensFashion || womensFashion || jewelery || electronics) {
        filteredProducts = filteredProducts.filter((product) => {
          if (mensFashion && product.category === "men's clothing") {
            return true;
          }
          if (womensFashion && product.category === "women's clothing") {
            return true;
          }
          if (electronics && product.category === "electronics") {
            return true;
          }
          if (jewelery && product.category === "jewelery") {
            return true;
          }
          return false;
        });
      }

      if (priceRange) {
        filteredProducts = filteredProducts.filter((product) => {
          return product.price < priceRange;
        });
      }

      state.filteredProducts = filteredProducts;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        const products = action.payload.docs.map((doc) => ({
          ...doc.data(),
        }));

        state.products = products;
        state.filteredProducts = products;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.error = action.payload.message;
      });
  },
});

export const getLoadingState = (state) => state.products.loading;
export const getProducts = (state) => state.products.products;
export const getFilteredProducts = (state) => state.products.filteredProducts;
export const getError = (state) => state.products.error;

export const { filterProducts } = productsSlice.actions;

export default productsSlice.reducer;
