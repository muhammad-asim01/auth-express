import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    status?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        success: false,
        data: [],
        error: err
    });
};


export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);