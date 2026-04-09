import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as cartService from '../services/cartService';

export const addToCart = async (req: AuthRequest, resp: Response) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartService.addToCart(
            req.user!.id,
            productId,
            quantity
        );

        resp.json(cart);
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
};