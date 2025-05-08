// src/utils/axiosClient.ts
import { API_BACKEND_BASE_URL} from "@/requests/Urls";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Extend AxiosRequestConfig to include auth flags and query params
export interface ExtendedRequestConfig<Params = any> extends Omit<AxiosRequestConfig, 'auth'> {
    requiresAuth?: boolean;
    params?: Params;
}

export class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.client = axios.create({
            baseURL,
            headers: { "Content-Type": "application/json" },
            ...config,
        });

        // Attach access token on requests when auth flag is true
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const extended = config as unknown as ExtendedRequestConfig;
                const requiresAuth = extended.requiresAuth ?? true;
                if (requiresAuth) {
                    const token = localStorage.getItem("accessToken");
                    if (token && extended.headers) {
                        extended.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const extended = error.config as unknown as ExtendedRequestConfig;
                if (error.response?.status === 401 && (extended.requiresAuth ?? true)) {
                    console.error("Unauthorized - token may be expired");
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * GET request with optional query params
     */
    public async get<T, P = any>(
        url: string,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config as AxiosRequestConfig);
        return response.data;
    }

    /**
     * POST request with body and optional config
     */
    public async post<T, U = any, P = any>(
        url: string,
        data?: U,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config as AxiosRequestConfig);
        return response.data;
    }

    /**
     * PUT request with body and optional config
     */
    public async put<T, U = any, P = any>(
        url: string,
        data?: U,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config as AxiosRequestConfig);
        return response.data;
    }

    /**
     * DELETE request with optional config
     */
    public async delete<T, P = any>(
        url: string,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config as AxiosRequestConfig);
        return response.data;
    }
}

// Singleton instance
const apiClient = new ApiClient(
    API_BACKEND_BASE_URL
);
export default apiClient;
