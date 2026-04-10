# E-commerce Backend (TypeScript)

A clean, interview-ready Node.js backend using Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, and layered architecture.

## Tech stack
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- CORS

## Folder structure

```bash
src/
 ├── config/
 ├── controllers/
 ├── middlewares/
 ├── models/
 ├── repositories/
 ├── routes/
 ├── services/
 ├── types/
 ├── utils/
 ├── app.ts
 └── server.ts
```

## Features
- Signup / Login
- Role-based auth (user/admin)
- Product CRUD (admin protected)
- Product listing with pagination and filtering
- Cart management
- Order placement with transaction
- Idempotent order creation using `x-idempotency-key`
- Race condition protection for stock updates
- Payment retry flow
- Order history, order details, admin status updates

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_ts
JWT_SECRET=supersecretkey
CLIENT_URL=http://localhost:5173
```

## Main routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart
- `POST /api/cart`
- `GET /api/cart`
- `PUT /api/cart`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/pay`
- `PUT /api/orders/:id` (admin)
- `PUT /api/orders/:id/cancel`

## Notes
- Make sure your login/signup response includes `role` in the returned `user` object so frontend admin checks work.
- For admin access, update a user document in MongoDB to `role: "admin"` and log in again.
