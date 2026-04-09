import mongoose from "mongoose"
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import * as orderRepo from '../repositories/orderRepository';
import * as cartRepo from "../repositories/cartRepository";

export const placeOrder = async(userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product")
        .session(session);

        if(!cart || cart.items.length === 0) {
            throw new Error('Cart is Empty');
        }

        let totalAmount = 0;

    for (const item of cart.items) {
      const product: any = item.product;

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
    }

    for (const item of cart.items) {
      const product: any = item.product;

      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    const order = await orderRepo.createorder(
      {
        user: userId,
        items: cart.items,
        totalAmount,
        status: "pending"
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