import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import * as cartController from '../controllers/cartController';

const router = express.Router();

router.post("/", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.put("/", protect, cartController.updateCart);
router.delete("/:productId", protect, cartController.removeItem);
router.delete("/", protect, cartController.clearCart);

export default router;