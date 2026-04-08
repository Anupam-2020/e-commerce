import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
    user?: any
}

export const authMiddleware = (
    req: AuthRequest,
    resp: Response,
    next: NextFunction
) => {
    let token;

    if(req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return resp.status(401).json({
            message: 'Not authorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch(err) {
        resp.status(401).json({
            message: 'Token failed'
        })
    }
};