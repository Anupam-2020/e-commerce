import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { placeOrder, 
  processPayment, 
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder } from '../controllers/orderController';
  import { isAdmin } from '../middlewares/adminMiddleware';

const router = express.Router();

router.post('/', protect, placeOrder);
router.post('/:id/pay', protect, processPayment);

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, isAdmin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;