import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/auth';

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin only.' });
    return;
  }

  next();
};
