import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import * as orderService from '../services/orderService';
import * as paymentService from '../services/paymentService';

export const placeOrder = async (req: AuthRequest, resp: Response) => {
    try {
        const idempotencyKey = req.headers['x-idempotency-key'] as string;

        if (!idempotencyKey) {
            return resp.status(400).json({
                message: "Idempotency key required"
            });
        }

        const order = await orderService.placeOrder(req.user!.id, idempotencyKey);

        resp.status(201).json(order);
    } catch (error: any) {
        resp.status(400).json({
            message: error.message
        });
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getOrders(req.user!.id);
    res.json(orders);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string, req.user!.id, req.user!.role);
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(404).json({ message });
  }
};

export const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    const order = await paymentService.processPayment(req.params.id as string);
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id as string, req.body.status);
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.cancelOrder(req.params.id as string, req.user!.id, req.user!.role);
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};
