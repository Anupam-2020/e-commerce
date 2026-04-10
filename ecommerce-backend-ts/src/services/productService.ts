import * as productRepo from '../repositories/productRepository';

export const createProduct = async (data: {
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
}) => {
  return productRepo.createProduct(data);
};

export const getProducts = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (query.minPrice) priceFilter.$gte = Number(query.minPrice);
    if (query.maxPrice) priceFilter.$lte = Number(query.maxPrice);
    filter.price = priceFilter;
  }

  return productRepo.getProducts(filter, skip, limit);
};

export const getProductById = async (id: string) => {
  const product = await productRepo.getProductById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

export const updateProduct = async (id: string, data: Record<string, unknown>) => {
  const product = await productRepo.updateProduct(id, data);
  if (!product) throw new Error('Product not found');
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await productRepo.deleteProduct(id);
  if (!product) throw new Error('Product not found');
  return { message: 'Product deleted' };
};
