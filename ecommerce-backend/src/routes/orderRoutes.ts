import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { placeOrder } from '../services/orderService';

const router = express.Router();

router.post('/', protect, placeOrder);

export default router;