import { Request, RequestHandler, Response } from "express";
import * as productService from '../services/productService';


export const createProduct = async(req: Request, resp: Response) => {
    console.log(req.body)
    try {
        const product = await productService.createProduct(req.body);
        resp.status(201).json({
            product: product
        });
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
};


export const getproducts = async(req: Request, resp: Response) => {
    try {
        const products = await productService.getProducts(req.query);
        resp.json(products);
    } catch(error: any) {
        resp.status(500).json({
            message: error.message
        })
    }
}

export const getProductById = async(req: Request, resp: Response) => {
    try {
        const product = await productService.getProductById(req.params.id as string);
        resp.json(product);
    } catch(error: any) {
        resp.status(500).json({
            message: error.message
        })
    }
}

export const updateProduct: RequestHandler = async (req: Request, resp: Response) => {
    try {
        const product = await productService.updateProduct(req.params.id as string, req.body)
        resp.json(product);
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
}


export const deleteProduct: RequestHandler = async (req: Request, resp: Response) => {
    try {
        const prod = await productService.deleteProduct(req.params.id as string);
        resp.json({
            message: `${prod?.name} deleted successfully`
        })
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
}