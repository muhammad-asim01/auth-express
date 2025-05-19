// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/auth.model';
import { asyncHandler } from '../middleware/errorHandler';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/validator';
import { sendResponse } from '../utils/response';
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token";
import crypto from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { AuthRequest } from '../middleware/authMiddleware';
import { clearCookies, setCookies } from '../utils/secureCookie';
import { sendEmail } from '../utils/emailSend';
import CONFIG from '../config/config';

//  url: /api/v1/auth/signup
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, fullname, password } = req.body;

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
    fullname,
    hashedPassword: password
  });

  return sendResponse(res, 201, true, 'User registered successfully', {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname
  });
});

// url: /api/v1/auth/signin
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

  // Check if user has a refreshToken, and it's still valid
  if (user.accessToken) {
    try {
      verifyToken(user.accessToken); // Throws if expired/invalid
      return sendResponse(res, 201, true, 'User already logged in');
    } catch (err) {
      // Token invalid or expired — remove it
      user.refreshToken = null;
      user.accessToken = null;
      await user.save();
    }
  }

  // Generate new tokens
  const payload = { userId: user._id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store new refreshToken in DB
  user.refreshToken = refreshToken;
  user.accessToken = accessToken;
  await user.save();

  setCookies(res, refreshToken);

  return sendResponse(res, 200, true, 'Login successful', { accessToken });
});


export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendResponse(res, 401, false, 'Unauthorized');
  const user = await User.findById(userId);
  if (!user) return sendResponse(res, 404, false, 'User not found');


  user.refreshToken = null;
  user.accessToken = null

  await user.save();

  clearCookies(res);

  return sendResponse(res, 200, true, "Logout successful");
});

// refrehed token 
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('Refresh token:', refreshToken);
  if (!refreshToken) return sendResponse(res, 401, false, 'No refresh token provided');

  const user = await User.findOne({ refreshToken });
  if (!user) return sendResponse(res, 403, false, 'Invalid refresh token');

  try {
    const decoded: { userId: string; email: string } | any = verifyToken(refreshToken);
    const payload = { userId: decoded.userId, email: decoded.email }
    const newAccessToken = generateAccessToken(payload);

    return sendResponse(res, 200, true, 'Access token refreshed', { accessToken: newAccessToken });
  } catch (err) {
    return sendResponse(res, 403, false, 'Invalid or expired refresh token');
  }
});


// url: /api/v1/auth/forget-password
export const forgetPassword = asyncHandler(async (req: Request, res: Response) => {


  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });


  if (!user) {
    // Respond success regardless of whether user exists
    return sendResponse(
      res,
      200,
      true,
      'user not exist with this email you have trying'
    );
  }

  // Generate token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await user.save();

  // Construct reset URL
  const resetUrl = `${CONFIG.FRONTEND_URL}/reset-password?token=${rawToken}`;

  const emailHtml = `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password. This link expires in 10 minutes.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    const result = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: emailHtml,
    });

    if (!result.success) {
      console.error('Failed to send reset email:', result.error);
    }
  } catch (error) {
    console.error('Unexpected error sending reset email:', error);
  }

  return sendResponse(
    res,
    200,
    true,
    'If that email exists, a password reset link has been sent'
  );
});

// url: /api/v1/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  console.log(req.body)

  if (!token || typeof token !== 'string') {
    return sendResponse(res, 400, false, 'Missing or invalid token');
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    return sendResponse(res, 400, false, 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters long');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }, // ensure token is not expired
  });

  if (!user) {
    return sendResponse(res, 400, false, 'Invalid or expired reset token');
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

  return sendResponse(res, 200, true, '2FA QR code generated', { qrCodeUrl: qrCode });
});


// url: /api/v1/auth/2fa/request
export const request2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) return sendResponse(res, 404, false, 'User not found');

  if (user.twoFactorEnabled) return sendResponse(res, 400, false, '2FA already enabled');

  user.twoFactorRequestStatus = 'pending';
  await user.save();

  return sendResponse(res, 200, true, '2FA request submitted and pending admin approval.');
});


// url: /api/v1/auth/2fa-approve
export const approve2FARequest = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.twoFactorRequestStatus !== 'pending') {
    return sendResponse(res, 400, false, 'Invalid request or user not pending approval');
  }

  user.twoFactorRequestStatus = 'approved';
  await user.save();

  return sendResponse(res, 200, true, '2FA request approved');
});

// Helper to hash backup codes
// const hashBackupCodes = async (codes: string[]) => {
//   const hashed = await Promise.all(
//     codes.map(async (code) => await bcrypt.hash(code, 12))
//   );
//   return hashed;
// };


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
export const disable2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.user?.userId;
  const { token } = req.body;
  const user = await User.findById(userId);
  if (!user || !user.twoFactorSecret) return sendResponse(res, 404, false, '2FA not setup');

  const isValid = authenticator.check(token, user.twoFactorSecret);
  if (!isValid) return sendResponse(res, 400, false, 'Invalid 2FA token');

  user.twoFactorSecret = undefined;
  user.twoFactorEnabled = false;
  user.backupCodes = [];

  await user.save();
  return sendResponse(res, 200, true, '2FA disabled successfully');
});



// // url: /api/v1/auth/2fa/enable
// export const enable2FA = asyncHandler(async (req: Request, res: Response) => {
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
