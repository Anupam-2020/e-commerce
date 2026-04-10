import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.signup(email, password);
    res.status(201).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    res.status(400).json({ message });
  }
};
