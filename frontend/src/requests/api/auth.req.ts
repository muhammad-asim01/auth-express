// v1/auth/signup

import apiClient from "@/lib/AxiosReq";
import { URLS } from "../Urls";

export const signup = async (data: any) => {
    const response = await apiClient.post(URLS.AUTH.SIGNUP, data);
    return response;
}

export const signIn = async (data: any) => {
    const response = await apiClient.post(URLS.AUTH.SIGNIN, data);
    return response;
}

export const logOut = async () => {
    const response = await apiClient.post(URLS.AUTH.LOGOUT);
    return response;
}

export const forgetPassword = async (data: { email: string }) => {
    const response = await apiClient.post(URLS.AUTH.FORGOT_PASSWORD, data);
    return response;
}

export const resetPassword = async (
    token: string,
    data: { newPassword: string }
) => {
    const response = await apiClient.post(
        URLS.AUTH.RESET_PASSWORD + encodeURIComponent(token),
        data
    );
    return response;
};


export const generateQrCode = async () => {
    const response = await apiClient.get(URLS.AUTH.SETUP_2FA);
    return response;
}

export const refreshToken = async () => {
    const response = await apiClient.get(URLS.AUTH.REFRESH_TOKEN);
    return response;
}

