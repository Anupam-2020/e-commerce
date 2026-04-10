import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api.ts";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await api.get("/products");
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  }
});

export default productSlice.reducer;