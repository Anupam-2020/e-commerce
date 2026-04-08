import * as authService from '../services/authService';
import { Response, Request } from 'express';

export const signup = async(req: Request, resp: Response) => {
    try {
        const { email, password } = req.body;
        const data = await authService.signup(email, password);
        resp.status(201).json(data);
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
}

export const login = async (req: Request, resp: Response) => {
    try {
        const { email, password } = req.body;
        const data = await authService.login(email, password);
        resp.status(200).json(data);
    } catch(error: any) {
        resp.status(400).json({
            message: error.message
        })
    }
}