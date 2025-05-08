import { Router } from 'express';
import { forgetPassword, login, logout, resetPassword, setup2FA } from '../controller/auth.controller';
import { register } from '../controller/auth.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const authRouter = Router();

//  url: /api/v1/auth/signup
authRouter.post('/signup', register);

//  url: /api/v1/auth/signin
authRouter.post('/signin', login);

//  url: /api/v1/auth/logout
authRouter.post('/logout', logout);

//  url: /api/v1/auth/forget-password
authRouter.post('/forget-password', forgetPassword);

//  url: /api/v1/auth/reset-password
authRouter.post('/reset-password/:token', resetPassword);

// url:/api/v1/auth/setup-2fa
authRouter.get('/setup-2fa', authenticateToken, setup2FA);

// // url:/api/v1/auth/verify-2fa
// authRouter.post('/verify-2fa', verify2FA);

// // url:/api/v1/auth/disable-2fa
// authRouter.post('/disable-2fa', disable2FA);

// // url:/api/v1/auth/reset-2fa
// authRouter.post('/reset-2fa', reset2FA);


export default authRouter;
