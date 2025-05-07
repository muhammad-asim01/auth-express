import { NextFunction, Request, Response } from "express";
import CONFIG from "../config/config";
import { sendResponse } from "../utils/response";
import { verifyToken } from "../utils/token";

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return sendResponse(res, 401, false, 'Access denied. No token provided.');
    }

    try {
        const decoded = verifyToken(token) as { userId: string; email: string };
        req.user = decoded;
        next();
    } catch (err) {
        return sendResponse(res, 403, false, 'Invalid or expired token.');
    }
};