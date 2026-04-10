import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as orderService from '../services/orderService';
import * as paymentService from '../services/paymentService';

export const placeOrder = async (req: AuthRequest, resp: Response) => {
    try {
        const idempotencyKey = req.headers['x-idempotency-key'] as string;

        if(!idempotencyKey) {
            return resp.status(400).json({
                message: "Idempotency key required"
            });
        }

        const order = await orderService.placeOrder(req.user!.id, idempotencyKey);
        resp.status(201).json(order);

    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
}

export const getOrders = async (req: AuthRequest, resp: Response) => {
    try {
        const orders = await orderService.getOrders(req.user!.id);
        resp.json(orders);
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};


export const getOrderById = async (req: AuthRequest, resp: Response) => {
    try {
        const order = await orderService.getOrderById(req.params.id as string);
        resp.json(order);
    } catch (error: any) {
        resp.status(404).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req: AuthRequest, resp: Response) => {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.id as string,
            req.body.status
        );

        resp.json(order);
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};



export const processPayment = async(req: AuthRequest, resp: Response) => {
    try {
        const order = await paymentService.processPayment(req.params.id as string);
        resp.json(order);
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        });
    }
};


export const cancelOrder = async (req: AuthRequest, resp: Response) => {
    try {
        const order = await orderService.cancelOrder(req.params.id as string);
        resp.json(order);
    } catch (error: any) {
        resp.status(400).json({ message: error.message });
    }
};