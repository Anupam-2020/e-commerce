import * as cartRepo from '../repositories/cartRepository';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

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