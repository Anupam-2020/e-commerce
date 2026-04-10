import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import type { Product, ProductFilters } from '../../types';
import type { RootState } from '../../app/store';

interface ProductsState {
  items: Product[];
  selected: Product | null;
  filters: ProductFilters;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selected: null,
  filters: {
    page: 1,
    limit: 8,
    category: '',
    minPrice: '',
    maxPrice: ''
  },
  loading: false,
  submitting: false,
  error: null
};

export const fetchProducts = createAsyncThunk<Product[], void, { state: RootState }>(
  'products/fetchAll',
  async (_, { getState }) => {
    const { filters } = getState().products;
    return apiRequest<Product[]>('/products', { method: 'GET' }, filters);
  }
);

export const fetchProductById = createAsyncThunk<Product, string>(
  'products/fetchOne',
  async (id) => apiRequest<Product>(`/products/${id}`)
);

export const createProduct = createAsyncThunk<Product, Partial<Product>, { state: RootState }>(
  'products/create',
  async (payload, { getState }) => {
    const token = getState().auth.token!;
    return apiRequest<Product>('/products', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });
  }
);

export const updateProduct = createAsyncThunk<Product, { id: string; data: Partial<Product> }, { state: RootState }>(
  'products/update',
  async ({ id, data }, { getState }) => {
    const token = getState().auth.token!;
    return apiRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data)
    });
  }
);

export const deleteProduct = createAsyncThunk<string, string, { state: RootState }>(
  'products/delete',
  async (id, { getState }) => {
    const token = getState().auth.token!;
    await apiRequest<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
      token
    });
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetSelectedProduct(state) {
      state.selected = null;
    },
    clearProductsError(state) {
      state.error = null;
    }
  },
extraReducers: (builder) => {
  builder
    .addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load products';
    })
    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.selected = action.payload;
    })
    .addCase(createProduct.fulfilled, (state, action) => {
      state.submitting = false;
      state.items.unshift(action.payload);
    })
    .addCase(updateProduct.fulfilled, (state, action) => {
      state.submitting = false;
      state.items = state.items.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
      state.selected = action.payload;
    })
    .addCase(deleteProduct.fulfilled, (state, action) => {
      state.submitting = false;
      state.items = state.items.filter((item) => item._id !== action.payload);
    })
    .addMatcher(
      (action) =>
        action.type.startsWith('products/') &&
        action.type.endsWith('/pending') &&
        !action.type.includes('fetchAll') &&
        !action.type.includes('fetchOne'),
      (state) => {
        state.submitting = true;
        state.error = null;
      }
    )
    .addMatcher(
      (action) =>
        action.type.startsWith('products/') &&
        action.type.endsWith('/rejected') &&
        !action.type.includes('fetchAll') &&
        !action.type.includes('fetchOne'),
      (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Product action failed';
      }
    );
}
});

export const { setFilters, resetSelectedProduct, clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;
