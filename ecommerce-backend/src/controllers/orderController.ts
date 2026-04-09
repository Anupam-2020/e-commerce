import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as orderService from '../services/orderService';

export const placeOrder = async (req: AuthRequest, resp: Response) => {
    try {
        const order = await orderService.placeOrder(req.user!.id);
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
}