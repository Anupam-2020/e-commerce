import { Order } from "../models/Order"

export const createorder = (data: any, session: any) => {
    return Order.create([data], { session });
};

export const getOrderByuser = (userId: string) => {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
};