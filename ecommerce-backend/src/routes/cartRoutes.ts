import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { addToCart } from '../controllers/cartController';

const router = express.Router();

router.post('/', protect, addToCart);

export default router;