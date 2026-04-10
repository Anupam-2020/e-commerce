import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import type { Cart } from '../../types';
import type { RootState } from '../../app/store';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  updating: false,
  error: null
};

export const fetchCart = createAsyncThunk<Cart | null, void, { state: RootState }>(
  'cart/fetch',
  async (_, { getState }) => {
    const token = getState().auth.token!;
    return apiRequest<Cart | null>('/cart', { method: 'GET', token });
  }
);

export const addToCart = createAsyncThunk<Cart, { productId: string; quantity: number }, { state: RootState }>(
  'cart/add',
  async (payload, { getState }) => {
    const token = getState().auth.token!;
    return apiRequest<Cart>('/cart', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  }
);

export const updateCart = createAsyncThunk<Cart, { productId: string; quantity: number }, { state: RootState }>(
  'cart/update',
  async (payload, { getState }) => {
    const token = getState().auth.token!;
    return apiRequest<Cart>('/cart', {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    });
  }
);

export const removeCartItem = createAsyncThunk<Cart, string, { state: RootState }>(
  'cart/removeItem',
  async (productId, { getState }) => {
    const token = getState().auth.token!;
    return apiRequest<Cart>(`/cart/${productId}`, {
      method: 'DELETE',
      token
    });
  }
);

export const clearCart = createAsyncThunk<void, void, { state: RootState }>(
  'cart/clear',
  async (_, { getState }) => {
    const token = getState().auth.token!;
    await apiRequest<{ message: string }>('/cart', {
      method: 'DELETE',
      token
    });
  }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      resetCartState(state) {
        state.cart = null;
        state.loading = false;
        state.updating = false;
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCart.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
        })
        .addCase(fetchCart.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to load cart';
        })
        .addCase(addToCart.fulfilled, (state, action) => {
          state.updating = false;
          state.cart = action.payload;
        })
        .addCase(updateCart.fulfilled, (state, action) => {
          state.updating = false;
          state.cart = action.payload;
        })
        .addCase(removeCartItem.fulfilled, (state, action) => {
          state.updating = false;
          state.cart = action.payload;
        })
        .addCase(clearCart.fulfilled, (state) => {
          state.updating = false;
          state.cart = null;
        })
        .addMatcher(
          (action) =>
            action.type.startsWith('cart/') &&
            action.type.endsWith('/pending') &&
            !action.type.includes('/fetch'),
          (state) => {
            state.updating = true;
            state.error = null;
          }
        )
        .addMatcher(
          (action) =>
            action.type.startsWith('cart/') &&
            action.type.endsWith('/rejected') &&
            !action.type.includes('/fetch'),
          (state, action) => {
            state.updating = false;
            state.error = action.error.message || 'Cart action failed';
          }
        );
    }
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
