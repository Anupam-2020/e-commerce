import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { placeOrder, processPayment } from '../controllers/orderController';

const router = express.Router();

router.post('/', protect, placeOrder);
router.post('/:id/pay', protect, processPayment);

export default router;