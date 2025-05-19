import ENVIROMENT from "@/config/ENV";

export const API_BACKEND_BASE_URL = ENVIROMENT.API_BACKEND_BASE_URL;

export const URLS = {
    AUTH: {
        SIGNUP: `/api/v1/auth/signup`,
        SIGNIN: `/api/v1/auth/signin`,
        LOGOUT: `/api/v1/auth/logout`,
        REFRESH_TOKEN: `/api/v1/auth/refresh-token`,
        VERIFY_EMAIL: `/api/v1/auth/verify-email`,
        FORGOT_PASSWORD: `/api/v1/auth/forget-password`,
        RESET_PASSWORD: `/api/v1/auth/reset-password?token=`,
        VERIFY_2FA: `/api/v1/auth/2fa/verify`,
        SETUP_2FA: `/api/v1/auth/setup-2fa`,
    }
}

