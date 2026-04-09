import { NextFunction, Response } from "express";
import { AuthRequest } from './authMiddleware';

export const isAdmin = (
    req: AuthRequest,
    resp: Response,
    next: NextFunction
) => {
    if(req.user?.role !== 'admin') {
        return resp.status(403).json({
            message: 'Access denied. Admin only.'
        });
    }

    next();
};