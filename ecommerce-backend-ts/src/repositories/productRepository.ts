import { IProduct, Product } from '../models/Product';

export const createProduct = (data: Partial<IProduct>) => Product.create(data);

export const getProducts = (filter: Record<string, unknown>, skip: number, limit: number) => {
  return Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const getProductById = (id: string) => Product.findById(id);

export const updateProduct = (id: string, data: Partial<IProduct>) => {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteProduct = (id: string) => Product.findByIdAndDelete(id);
