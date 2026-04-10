import * as paymentService from './../services/paymentService';
import { Order } from "../models/Order"
import { AuthRequest } from '../middlewares/authMiddleware';

export const createorder = (data: any, session: any) => {
    return Order.create([data], { session });
};

export const getOrderByuser = (userId: string) => {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
};


export const updatePaymentStatus = async (orderid: string, paymentStatus: string, status?: string) => {
    const updateData: any  = { paymentStatus };

    if(status) {
        updateData.status = status;
    }

    return Order.findByIdAndUpdate(orderid, updateData, { new: true });
}