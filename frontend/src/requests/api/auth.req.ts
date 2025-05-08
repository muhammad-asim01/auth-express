// v1/auth/signup

import apiClient from "@/lib/AxiosReq";
import { URLS } from "../Urls";

export const signup = async (data: any) => {
    const response = await apiClient.post(URLS.AUTH.SIGNUP, data);
    return response;
}

