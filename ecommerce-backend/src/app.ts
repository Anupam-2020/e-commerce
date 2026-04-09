import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errormiddleware';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, resp) => {
    resp.send('App is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running omn Port ${PORT}`));