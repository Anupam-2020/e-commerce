import mongoose from "mongoose"
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import * as orderRepo from '../repositories/orderRepository';
import * as cartRepo from "../repositories/cartRepository";
import { Order } from "../models/Order";


export const getOrders = async (userId: string) => {
    return orderRepo.getOrderByuser(userId);
};


export const getOrderById = async (orderId: string) => {
    const order = await orderRepo.getorderById(orderId);
    if (!order) throw new Error("Order not found");
    return order;
};


export const updateOrderStatus = async (
    orderId: string,
    status: string
) => {
    return orderRepo.updatePaymentWithRetry(orderId, { status });
};


export const placeOrder = async(userId: string, idempotencyKey: string) => {
    // check if order is already processed.
    const existingOrder = await Order.findOne({ idempotencyKey });

    if(existingOrder) {
        return existingOrder;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product")
        .session(session);

        console.log(cart);

        if(!cart || cart.items.length === 0) {
            throw new Error('Cart is Empty');
        }

        let totalAmount = 0;

        // commenting this out because the below for loop will do both checking stock and updating cart with checking race condition.
        // for (const item of cart.items) {
        //     const product: any = item.product;
        //     // This check is for UX optimization. Below we're still checking product stock (_id: product._id, stock: { $gte: item.quantity }) for race condition.
        //     if (product.stock < item.quantity) {
        //         throw new Error(`Insufficient stock for ${product.name}`);
        //     }
        // }

        for (const item of cart.items) {
            const product: any = item.product;

            if (product.stock < item.quantity) { // this is optional check taken from above commented for-loop.
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            const updated = await Product.findByIdAndUpdate(
                // product._id,
                { // This update has been made to prevent race condition.
                    _id: product._id,
                    stock: { $gte: item.quantity } // this works similar to the above check(product.stock < item.quantity) We're doing at 2 places to reduce DB load in this step and for better UX. 
                },
                { $inc: { stock: -item.quantity } },
                { session }
            );

            if(!updated) {
                throw new Error(`Stock conflict for ${product.name}`);
            }

            totalAmount += product.price * item.quantity;
        }

        const order = await orderRepo.createorder(
            {
                user: userId,
                items: cart.items,
                totalAmount,
                status: "pending",
                paymentStatus: "pending",
                idempotencyKey
            },
            session
        );

        await cartRepo.clearCart(userId, session);

        await session.commitTransaction();
        session.endSession();

        return order[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


export const cancelOrder = async (orderId: string) => {
    const order = await orderRepo.getorderById(orderId);

    if (!order) throw new Error("Order not found");

    if (order.status === "shipped" || order.status === "delivered") {
        throw new Error("Cannot cancel this order");
    }

    return orderRepo.updatePaymentWithRetry(orderId, {
        status: "cancelled"
    });
};