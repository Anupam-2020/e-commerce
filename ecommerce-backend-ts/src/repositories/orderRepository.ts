import { ClientSession } from 'mongoose';
import { IOrder, Order } from '../models/Order';

export const createorder = (data: any) => {
    return Order.create(data);
};

export const getOrdersByUser = (userId: string) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = (orderId: string) => {
  return Order.findById(orderId);
};

export const updateOrder = (orderId: string, updateData: Record<string, unknown>) => {
  return Order.findByIdAndUpdate(orderId, updateData, { new: true, runValidators: true });
};
