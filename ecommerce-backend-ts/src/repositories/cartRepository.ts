import { ClientSession } from 'mongoose';
import { Cart } from '../models/Cart';

export const findCartByUser = (userId: string) => {
  return Cart.findOne({ user: userId }).populate('items.product');
};

export const createCart = (data: { user: string; items: Array<{ product: string; quantity: number }> }) => {
  return Cart.create(data);
};

export const saveCart = (cart: InstanceType<typeof Cart>) => cart.save();

export const clearCart = (userId: string, session?: ClientSession) => {
  return Cart.findOneAndDelete({ user: userId }, session ? { session } : {});
};
