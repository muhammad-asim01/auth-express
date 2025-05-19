import dotenv, { config } from 'dotenv';

dotenv.config()

interface IConfig {
    PORT: number;
    NODE_ENV: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    FRONTEND_URL: string;
    RESEND_API_KEY:string
}

const CONFIG: IConfig = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!
};

export default CONFIG;

export const ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
