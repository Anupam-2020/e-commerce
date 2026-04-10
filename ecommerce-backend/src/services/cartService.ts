import * as cartRepo from '../repositories/cartRepository';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

export const getCart = async (userId: string) => {
    const cart = await cartRepo.findCartByUser(userId).populate("items.product");
    return cart;
};

export const addToCart = async (userId: string, productId: string, quantity: number) => {
    const product = await Product.findById(productId);
    if(!product) throw new Error("product not found");

    if(product.stock < quantity) {
        throw new Error('Not enough stock');
    }

    let cart = await cartRepo.findCartByUser(userId);
    if(!cart) {
        return cartRepo.createCart({
            user: userId,
            items: [{
                product: productId,
                quantity
            }]
        })
    }

    const itemIndex = cart.items.findIndex(
        (item: any) => item.product.toString() === productId
    );

    const existingItem = cart.items[itemIndex];

    if(existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: new mongoose.Types.ObjectId(productId),
            quantity
        });
    }

    return cartRepo.saveCart(cart);
}


export const updateCart = async (
    userId: string,
    productId: string,
    quantity: number
) => {
    const cart = await cartRepo.findCartByUser(userId);

    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex(
        (i: any) => i.product.toString() === productId
    );

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    const item = cart.items[itemIndex];

    if (!item) {
        throw new Error("Item not found");
    }

    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        item.quantity = quantity;
    }

    return cartRepo.saveCart(cart);
};


export const removeItem = async (
    userId: string,
    productId: string
) => {
    const cart = await cartRepo.findCartByUser(userId);

    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
        (item: any) => item.product.toString() !== productId
    );

    return cartRepo.saveCart(cart);
};

export const clearCart = async (userId: string) => {
    return cartRepo.clearCart(userId);
};