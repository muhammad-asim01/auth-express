// src/middleware/auth.middleware.ts
import { RequestHandler, Request } from 'express';
import { sendResponse } from '../utils/response';
import { verifyToken } from '../utils/token';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    sendResponse(res, 401, false, 'Access denied. No token provided.');
    return;
  }

  try {
    const decoded = verifyToken(token) as { userId: string; email: string };
    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    sendResponse(res, 403, false, 'Invalid or expired token.');
    return;
  }
};
