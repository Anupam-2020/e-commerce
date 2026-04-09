import { Product, IProduct } from "../models/Product"

export const createProduct = (data: Partial<IProduct>) => {
    return Product.create(data);
};

export const getProducts = (query: any, skip: number, limit: number) => {
    return Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1});
};

export const getProductById = (id: string) => {
    return Product.findById(id);
};

export const updateProduct = (id: string, payload: Partial<IProduct>) => {
    return Product.findByIdAndUpdate(id, payload, { new: true }); // { new: true } returns the updated document
};

export const deleteProduct = (id: string) => {
    return Product.findByIdAndUpdate(id);
};