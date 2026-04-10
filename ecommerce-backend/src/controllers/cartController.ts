import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as cartService from '../services/cartService';

export const getCart = async (req: AuthRequest, resp: Response) => {
    try {
        const cart = await cartService.getCart(req.user!.id);
        resp.json(cart);
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};


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

export const updateCart = async (req: AuthRequest, resp: Response) => {
    try {

        const { productId, quantity } = req.body;

        const cart = await cartService.updateCart(
            req.user!.id,
            productId,
            quantity
        );

        resp.json(cart);
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};


export const removeItem = async (req: AuthRequest, resp: Response) => {
    try {
        const { productId } = req.params;

        const cart = await cartService.removeItem(
            req.user!.id,
            productId as string
        );

        resp.json(cart);
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};


export const clearCart = async (req: AuthRequest, resp: Response) => {
    try {
        await cartService.clearCart(req.user!.id);
        resp.json({ message: "Cart cleared" });
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};