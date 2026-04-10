import type { AuthResponse } from '../types';

const KEY = 'ecommerce_auth';

export const loadAuth = (): AuthResponse | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as AuthResponse : null;
  } catch {
    return null;
  }
};

export const saveAuth = (data: AuthResponse | null) => {
  if (!data) {
    localStorage.removeItem(KEY);
    return;
  }

  localStorage.setItem(KEY, JSON.stringify(data));
};

export const createIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
