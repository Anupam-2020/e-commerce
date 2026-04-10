import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts(req.query as Record<string, unknown>);
    res.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(500).json({ message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id as string);
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(404).json({ message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(req.params.id as string, req.body);
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.deleteProduct(req.params.id as string);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};
