// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/auth.model';
import { asyncHandler } from '../middleware/errorHandler';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/validator';
import { sendResponse } from '../utils/response';
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import crypto from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { AuthRequest } from '../middleware/authMiddleware';

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
    return sendResponse(res, 201, true, 'User already logged in');
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



// Helper to hash backup codes
const hashBackupCodes = async (codes: string[]) => {
  const hashed = await Promise.all(
    codes.map(async (code) => await bcrypt.hash(code, 12))
  );
  return hashed;
};

// url: /api/v1/auth/2fa/setup
export const setup2FA = asyncHandler(async (req: AuthRequest, res: Response) => {


  const userId = req.user?.userId;
  const user = await User.findById(userId);
  if (!user) return sendResponse(res, 404, false, 'User not found');

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, 'MyApp', secret);
  const qrCode = await QRCode.toDataURL(otpauth);

  user.twoFactorSecret = secret;
  await user.save();

  return sendResponse(res, 200, true, '2FA QR code generated', { qrCode });
});

// url: /api/v1/auth/2fa/verify
// export const verify2FA = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.user?.userId;
//   const { token } = req.body;
//   const user = await User.findById(userId);
//   if (!user || !user.twoFactorSecret) return sendResponse(res, 404, false, '2FA not setup');

//   const isValid = authenticator.check(token, user.twoFactorSecret);
//   if (!isValid) return sendResponse(res, 400, false, 'Invalid 2FA token');

//   user.twoFactorEnabled = true;

//   const backupCodes = Array.from({ length: 5 }, () => crypto.randomBytes(4).toString('hex'));
//   user.backupCodes = await hashBackupCodes(backupCodes);

//   await user.save();

//   return sendResponse(res, 200, true, '2FA enabled successfully', { backupCodes });
// });

// // url: /api/v1/auth/2fa/disable
// export const disable2FA = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.user?.userId;
//   const { token } = req.body;
//   const user = await User.findById(userId);
//   if (!user || !user.twoFactorSecret) return sendResponse(res, 404, false, '2FA not setup');

//   const isValid = authenticator.check(token, user.twoFactorSecret);
//   if (!isValid) return sendResponse(res, 400, false, 'Invalid 2FA token');

//   user.twoFactorSecret = undefined;
//   user.twoFactorEnabled = false;
//   user.backupCodes = [];

//   await user.save();
//   return sendResponse(res, 200, true, '2FA disabled successfully');
// });

// // url: /api/v1/auth/2fa/reset
// export const reset2FA = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.user?.userId;
//   const { backupCode } = req.body;

//   const user = await User.findById(userId);
//   if (!user || !user.backupCodes || user.backupCodes.length === 0) {
//     return sendResponse(res, 403, false, 'No backup codes found');
//   }

//   const matched = await Promise.any(
//     user.backupCodes.map(async (stored) => bcrypt.compare(backupCode, stored))
//   ).catch(() => false);

//   if (!matched) return sendResponse(res, 400, false, 'Invalid backup code');

//   // Invalidate all previous backup codes
//   user.twoFactorSecret = undefined;
//   user.twoFactorEnabled = false;
//   user.backupCodes = [];
//   await user.save();

//   return sendResponse(res, 200, true, '2FA has been reset. Please set it up again.');
// });
