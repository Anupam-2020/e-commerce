import mongoose from 'mongoose';
import { Product } from '../models/Product';
import * as cartRepo from '../repositories/cartRepository';

export const addToCart = async (userId: string, productId: string, quantity: number) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Not enough stock');

  let cart = await cartRepo.findCartByUser(userId);

  if (!cart) {
    await cartRepo.createCart({
      user: userId,
      items: [{ product: productId, quantity }]
    });
    return cartRepo.findCartByUser(userId);
  }

  const itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);
  const existingItem = cart.items[itemIndex];

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: new mongoose.Types.ObjectId(productId),
      quantity
    } as any);
  }

  await cartRepo.saveCart(cart as any);
  return cartRepo.findCartByUser(userId);
};

export const getCart = async (userId: string) => {
  return cartRepo.findCartByUser(userId);
};

export const updateCart = async (
    userId: string,
    productId: string,
    quantity: number
) => {
    const cart = await cartRepo.findCartByUser(userId);

    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex((i: any) => {
        const currentProductId =
            typeof i.product === "object" && i.product?._id
                ? i.product._id.toString()
                : i.product.toString();

        return currentProductId === productId;
    });

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    const item = cart.items[itemIndex];

    if (!item) {
        throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        item.quantity = quantity;
    }

    await cartRepo.saveCart(cart);
    return cartRepo.findCartByUser(userId);
};

export const removeItem = async (
    userId: string,
    productId: string
) => {
    const cart = await cartRepo.findCartByUser(userId);

    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter((item: any) => {
        const currentProductId =
            typeof item.product === "object" && item.product?._id
                ? item.product._id.toString()
                : item.product.toString();

        return currentProductId !== productId;
    });

    await cartRepo.saveCart(cart);
    return cartRepo.findCartByUser(userId);
};

export const clearCart = async (userId: string) => {
  await cartRepo.clearCart(userId);
  return { message: 'Cart cleared' };
};
