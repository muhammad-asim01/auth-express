// src/middleware/auth.middleware.ts
import { RequestHandler, Request } from 'express';
import { sendResponse } from '../utils/response';
import { verifyToken } from '../utils/token';

import { TokenExpiredError } from 'jsonwebtoken';
import { clearCookies } from '../utils/secureCookie';
export interface AuthRequest extends Request {
  user?: { userId: string };
}

import { User } from '../models/auth.model';
export const authenticateToken: RequestHandler = (req: AuthRequest, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token === undefined || token === null) {
    clearCookies(res);
    sendResponse(res, 401, false, 'Access denied. No token provided.');
    const userId = req.user?.userId;
    if (userId) {
      
      User.findById(userId)
        .then((user) => {
          if (user) {
            user.refreshToken = null;
            user.accessToken = null;
            return user.save();
          }
        })
        .catch((err) => {
          console.error('Error clearing tokens:', err);
        });
    }
    return;
  }



  try {
    const decoded = verifyToken(token as string) as { userId: string; email: string };
    if (!decoded) {
      sendResponse(res, 403, false, 'Invalid token.');
      return;
    }
    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      sendResponse(res, 401, false, 'Token expired');
      return;
    }
    sendResponse(res, 403, false, 'Invalid or expired token.');
    return;
  }
};
