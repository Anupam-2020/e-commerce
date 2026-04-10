# E-Commerce Frontend

React + TypeScript + Redux Toolkit frontend for the Node.js e-commerce backend you built.

## Features
- Signup and login
- Product listing with filters
- Product detail page
- Cart add, update, remove, clear
- Place order with idempotency key header
- Payment processing and retry through the same pay endpoint
- Order history and order detail page
- Admin product create, update, delete
- Admin order status update

## Required backend routes
- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`
- GET `/api/cart`
- POST `/api/cart`
- PUT `/api/cart`
- DELETE `/api/cart/:productId`
- DELETE `/api/cart`
- POST `/api/orders`
- GET `/api/orders`
- GET `/api/orders/:id`
- POST `/api/orders/:id/pay`
- PUT `/api/orders/:id`
- PUT `/api/orders/:id/cancel`

## Run locally
1. Copy `.env.example` to `.env`
2. Set `VITE_API_BASE_URL=http://localhost:5000/api`
3. Install packages
   ```bash
   npm install
   ```
4. Start dev server
   ```bash
   npm run dev
   ```

## Notes
- The app stores auth data in localStorage.
- Order placement sends an `x-idempotency-key` header from the frontend.
- Styling is intentionally simple, clean, and interview-friendly.
