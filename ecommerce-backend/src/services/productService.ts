import * as ProductRepo from '../repositories/productRepository';

export const createProduct = async(data: any) => {
    return ProductRepo.createProduct(data);
}

export const getProducts = async(query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if(query.category) {
        filter.category = query.category;
    }

    if(query.minPrice || query.maxPrice) {
        filter.price = {};
        if(query.minPrice) filter.price.$gte = Number(query.minPrice);
        if(query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    return ProductRepo.getProducts(filter, skip, limit);
}

export const getProductById = async (id: string) => {
    const product = await ProductRepo.getProductById(id);
    if(!product) throw new Error('Product not found');
    return product;
}


export const updateProduct = async(id: string, payload: any) => {
    return ProductRepo.updateProduct(id, payload);
}

export const deleteProduct = async (id: string) => {
    return ProductRepo.deleteProduct(id);
}