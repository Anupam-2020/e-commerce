import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    resp.status(500).json({
        message: err.message || 'Internal Server error'
    });
};