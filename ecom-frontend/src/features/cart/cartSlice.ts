import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";


export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await api.get("/cart");
  return res.data;
});


export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await api.post("/cart", { productId, quantity });
    return res.data;
  }
);

export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }: any) => {
    const res = await api.put(`/cart/${id}`, { quantity });
    return res.data;
  }
);


export const removeCart = createAsyncThunk(
  "cart/remove",
  async (id: string) => {
    await api.delete(`/cart/${id}`);
    return id;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetch
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })

      // add
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      // update
      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      // remove
      .addCase(removeCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i: any) => i._id !== action.payload
        );
      });
  }
});

export default cartSlice.reducer;