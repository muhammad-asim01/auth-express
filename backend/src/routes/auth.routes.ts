import { Router } from 'express';
import { forgetPassword, login, logout, resetPassword } from '../controller/auth.controller';
import { register } from '../controller/auth.controller';

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

export default authRouter;
