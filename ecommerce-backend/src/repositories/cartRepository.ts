import { Cart } from "../models/Cart"

export const findCartByUser = (userId: string) => {
    return Cart.findOne({ user: userId });
}

export const createCart = (data: any) => {
    return Cart.create(data);
}


export const saveCart = (cart: any) => {
    return cart.save(); // Save the cart document to the database
}

export const clearCart = (userid: string, session?: any) => {
    return Cart.findOneAndDelete({ user: userid }, { session }); // Delete the cart for the user and optionally use a session for transaction support
}