export type UserRole = 'user' | 'admin';

export interface User {
  _id?: string;
  id?: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product | string;
  quantity: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  retryCount?: number;
  maxRetries?: number;
  lastRetryAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number | '';
  maxPrice?: number | '';
}
