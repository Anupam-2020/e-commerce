import mongoose from 'mongoose';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import * as cartRepo from '../repositories/cartRepository';
import * as orderRepo from '../repositories/orderRepository';

export const placeOrder = async (userId: string, idempotencyKey: string) => {
    // check if order already exists for this idempotency key
    const existingOrder = await Order.findOne({ idempotencyKey });

    if (existingOrder) {
        return existingOrder;
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new Error('Cart is Empty');
    }

    let totalAmount = 0;

    for (const item of cart.items) {
        const product: any = item.product;

        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        const updated = await Product.findOneAndUpdate(
            {
                _id: product._id,
                stock: { $gte: item.quantity }
            },
            {
                $inc: { stock: -item.quantity }
            },
            {
                new: true
            }
        );

        if (!updated) {
            throw new Error(`Stock conflict for ${product.name}`);
        }

        totalAmount += product.price * item.quantity;
    }

    const orderItems = cart.items.map((item: any) => {
      const product: any = item.product;

      return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
      };
    });

    const order = await orderRepo.createorder(
      {
          user: userId,
          items: orderItems,
          totalAmount,
          status: 'pending',
          paymentStatus: 'pending',
          idempotencyKey
      }
    );

    await cartRepo.clearCart(userId);

    return Array.isArray(order) ? order[0] : order;
};

export const getOrders = async (userId: string) => {
  return orderRepo.getOrdersByUser(userId);
};

export const getOrderById = async (orderId: string, userId?: string, role?: string) => {
  const order = await orderRepo.getOrderById(orderId);
  if (!order) throw new Error('Order not found');

  if (role !== 'admin' && String(order.user) !== userId) {
    throw new Error('Not authorized to view this order');
  }

  return order;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await orderRepo.updateOrder(orderId, { status });
  if (!order) throw new Error('Order not found');
  return order;
};

export const cancelOrder = async (orderId: string, userId: string, role?: string) => {
  const order = await orderRepo.getOrderById(orderId);
  if (!order) throw new Error('Order not found');

  if (role !== 'admin' && String(order.user) !== userId) {
    throw new Error('Not authorized to cancel this order');
  }

  if (order.status === 'shipped' || order.status === 'delivered') {
    throw new Error('Cannot cancel this order');
  }

  const updated = await orderRepo.updateOrder(orderId, { status: 'cancelled' });
  if (!updated) throw new Error('Order not found');
  return updated;
};
