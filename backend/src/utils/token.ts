import jwt from 'jsonwebtoken';
import CONFIG from '../config/config';

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: '2s' });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, CONFIG.JWT_SECRET);
};

export const decodeToken = (token: string) => {
    return jwt.decode(token);
};


