import express from "express";
import * as productController from '../controllers/productController';
import { protect } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";

const router = express.Router();

// public
router.get('/', productController.getproducts);
router.get('/:id', productController.getProductById);

//private
router.post('/', protect, isAdmin, productController.createProduct);
router.put('/:id', protect, isAdmin, productController.updateProduct);
router.delete('/:id', protect, isAdmin, productController.deleteProduct);

export default router;