// src/middleware/admin.middleware.ts
import { RequestHandler } from 'express';
import { sendResponse } from '../utils/response';
import { User } from '../models/auth.model';
import { AuthRequest } from './authMiddleware';


export const requireAdmin: RequestHandler = async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;

  if (!userId) {
    sendResponse(res, 401, false, 'Unauthorized');
    return;
  }

  const user = await User.findById(userId);
  if (!user || !user.role || user.role !== 'admin') {
    sendResponse(res, 403, false, 'Access denied. Admins only.');
    return;
  }

  next();
};
