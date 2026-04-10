import { Order } from "../models/Order"

export const createorder = (data: any, session: any) => {
    return Order.create([data], { session });
};

export const getOrderByuser = (userId: string) => {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
};


// export const updatePaymentStatus = async (orderid: string, paymentStatus: string, status?: string) => {
//     const updateData: any  = { paymentStatus };

//     if(status) {
//         updateData.status = status;
//     }

//     return Order.findByIdAndUpdate(orderid, updateData, { new: true });
// }

export const getorderById = async(orderId: string) => {
    return Order.findById(orderId);
}

export const updatePaymentWithRetry = async(orderId: string, updateData: any) => {

    return Order.findByIdAndUpdate(orderId, updateData, { new: true });
}