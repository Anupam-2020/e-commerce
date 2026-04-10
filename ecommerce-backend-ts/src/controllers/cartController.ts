import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import * as cartService from '../services/cartService';

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user!.id, productId, quantity);
    res.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const updateCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateCart(req.user!.id, productId, quantity);
    res.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.removeItem(req.user!.id, req.params.productId as string);
    res.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const result = await cartService.clearCart(req.user!.id);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};
