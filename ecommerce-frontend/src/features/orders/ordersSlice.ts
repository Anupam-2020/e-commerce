import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import type { Order } from '../../types';
import type { RootState } from '../../app/store';
import { createIdempotencyKey } from '../../utils/storage';

interface OrdersState {
  items: Order[];
  selected: Order | null;
  loading: boolean;
  processing: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  selected: null,
  loading: false,
  processing: false,
  error: null
};

export const fetchOrders = createAsyncThunk<Order[], void, { state: RootState }>(
    'orders/fetchAll',
    async (_, { getState }) => {
      const token = getState().auth.token!;
      return apiRequest<Order[]>('/orders', { method: 'GET', token });
    }
);

export const fetchOrderById = createAsyncThunk<Order, string, { state: RootState }>(
    'orders/fetchOne',
    async (id, { getState }) => {
      const token = getState().auth.token!;
      return apiRequest<Order>(`/orders/${id}`, { method: 'GET', token });
    }
);

export const placeOrder = createAsyncThunk<Order, void, { state: RootState }>(
    'orders/place',
    async (_, { getState }) => {
      const token = getState().auth.token!;
      return apiRequest<Order>('/orders', {
        method: 'POST',
        token,
        headers: {
          'x-idempotency-key': createIdempotencyKey()
        }
      });
    }
);

export const processPayment = createAsyncThunk<Order, string, { state: RootState }>(
    'orders/pay',
    async (id, { getState }) => {
      const token = getState().auth.token!;
      return apiRequest<Order>(`/orders/${id}/pay`, {
        method: 'POST',
        token
      });
    }
);

export const updateOrderStatus = createAsyncThunk<Order, { id: string; status: string }, { state: RootState }>(
    'orders/updateStatus',
    async ({ id, status }, { getState }) => {
      const token = getState().auth.token!;
      return apiRequest<Order>(`/orders/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ status })
      });
    }
);

export const cancelOrder = createAsyncThunk<Order, string, { state: RootState }>(
    'orders/cancel',
    async (id, { getState }) => {
      const token = getState().auth.token!;
      return apiRequest<Order>(`/orders/${id}/cancel`, {
        method: 'PUT',
        token
      });
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
      clearOrdersError(state) {
        state.error = null;
      },
      resetSelectedOrder(state) {
        state.selected = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrders.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to load orders';
        })
        .addCase(fetchOrderById.fulfilled, (state, action) => {
          state.selected = action.payload;
        })
        .addCase(placeOrder.fulfilled, (state, action) => {
          state.processing = false;
          state.items.unshift(action.payload);
          state.selected = action.payload;
        })
        .addCase(processPayment.fulfilled, (state, action) => {
          state.processing = false;
          state.items = state.items.map((order) =>
            order._id === action.payload._id ? action.payload : order
          );
          state.selected = action.payload;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
          state.processing = false;
          state.items = state.items.map((order) =>
            order._id === action.payload._id ? action.payload : order
          );
          state.selected = action.payload;
        })
        .addCase(cancelOrder.fulfilled, (state, action) => {
          state.processing = false;
          state.items = state.items.map((order) =>
            order._id === action.payload._id ? action.payload : order
          );
          state.selected = action.payload;
        })
        .addMatcher(
          (action) =>
            action.type.startsWith('orders/') &&
            action.type.endsWith('/pending') &&
            !action.type.includes('fetchAll') &&
            !action.type.includes('fetchOne'),
          (state) => {
            state.processing = true;
            state.error = null;
          }
        )
        .addMatcher(
          (action) =>
            action.type.startsWith('orders/') &&
            action.type.endsWith('/rejected') &&
            !action.type.includes('fetchAll') &&
            !action.type.includes('fetchOne'),
          (state, action) => {
            state.processing = false;
            state.error = action.error.message || 'Order action failed';
          }
        );
    }
});

export const { clearOrdersError, resetSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
