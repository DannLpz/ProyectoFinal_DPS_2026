import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;
    const result = await authService.loginUser(identifier, password);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}