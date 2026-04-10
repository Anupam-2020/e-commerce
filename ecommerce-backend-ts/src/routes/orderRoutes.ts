import express from 'express';
import * as orderController from '../controllers/orderController';
import { protect } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/adminMiddleware';

const router = express.Router();

router.post('/', protect, orderController.placeOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrderById);
router.post('/:id/pay', protect, orderController.processPayment);
router.put('/:id', protect, isAdmin, orderController.updateOrderStatus);
router.put('/:id/cancel', protect, orderController.cancelOrder);

export default router;
