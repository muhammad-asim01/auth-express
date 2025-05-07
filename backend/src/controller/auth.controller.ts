// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/auth.model';
import CONFIG from '../config/config';
import { asyncHandler } from '../middleware/ErrorHandlar';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/validator';
import { sendResponse } from '../utils/response';
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import crypto from 'crypto';

//  url: /api/v1/auth/signup
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!EMAIL_REGEX.test(email)) {
    return sendResponse(res, 400, false, 'Invalid email format');
  }

  if (!PASSWORD_REGEX.test(password)) {
    return sendResponse(res, 400, false, 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters long');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendResponse(res, 400, false, 'User already exists');
  }

  const newUser = await User.create({
    email,
    username,
    hashedPassword: password
  });

  return sendResponse(res, 201, true, 'User registered successfully', {
    id: newUser._id,
    email: newUser.email,
    username: newUser.username
  });
});

//  url: /api/v1/auth/signin
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, 401, false, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    return sendResponse(res, 401, false, 'Invalid credentials');
  }

  // check if user is already logged in
  if (user.refreshToken) {
    return sendResponse(res, 401, false, 'User already logged in');
  }

  const payload = { userId: user._id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  // You can optionally set the refresh token as a secure, HTTP-only cookie:
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return sendResponse(res, 200, true, 'Login successful', { accessToken });
});


//  url: /api/v1/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log(refreshToken);

  const user = await User.findOne({ refreshToken });
  console.log(user);
  if (!user) {
    return sendResponse(res, 401, false, 'Invalid refresh token');
  }

  user.refreshToken = null as any;
  await user.save();

  res.clearCookie('refreshToken');
  return sendResponse(res, 200, true, 'Logout successful');
});

// url: /api/v1/auth/forget-password

export const forgetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return sendResponse(res, 404, false, 'Email not found');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.save();

  const resetToken = token;


  return sendResponse(res, 200, true, 'Password reset link sent to email', { resetToken });
});

// url: /api/v1/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }, // ensure token is not expired
  });

  if (!user) {
    return sendResponse(res, 400, false, 'Invalid or expired reset token');
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    return sendResponse(res, 400, false, 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters long');
  }

  const isPasswordSame = await bcrypt.compare(newPassword, user.hashedPassword);
  if (isPasswordSame) {
    return sendResponse(res, 400, false, 'New password cannot be the same as the old password');
  }

  user.hashedPassword = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return sendResponse(res, 200, true, 'Password reset successful');
});


