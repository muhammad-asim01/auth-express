// src/utils/axiosClient.ts
import { API_BACKEND_BASE_URL, URLS } from "@/requests/Urls";
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

export interface ExtendedRequestConfig<Params = any>
    extends Omit<AxiosRequestConfig, "auth"> {
    requiresAuth?: boolean;
    params?: Params;
    _retry?: boolean;
}

export class ApiClient {
    private client: AxiosInstance;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.client = axios.create({
            baseURL,
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            ...config,
        });

        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const extended = config as ExtendedRequestConfig;
                const requiresAuth = extended.requiresAuth ?? true;

                if (requiresAuth) {
                    const token = localStorage.getItem("accessToken");
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config as ExtendedRequestConfig;

                if (
                    error.response?.status === 401 &&
                    (originalRequest.requiresAuth ?? true) &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    if (this.isRefreshing) {
                        return new Promise((resolve) => {
                            this.refreshSubscribers.push((token: string) => {
                                originalRequest.headers = {
                                    ...originalRequest.headers,
                                    Authorization: `Bearer ${token}`,
                                };
                                resolve(this.client(originalRequest));
                            });
                        });
                    }

                    this.isRefreshing = true;

                    try {
                        const refreshResponse = await this.client.post<{ accessToken: string }>(
                           URLS.AUTH.REFRESH_TOKEN,
                            {},
                            { requiresAuth: false }
                        );

                        const newAccessToken = refreshResponse.data.accessToken;
                        localStorage.setItem("accessToken", newAccessToken);

                        this.refreshSubscribers.forEach((cb) => cb(newAccessToken));
                        this.refreshSubscribers = [];

                        originalRequest.headers = {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${newAccessToken}`,
                        };

                        return this.client(originalRequest);
                    } catch (refreshError) {
                        localStorage.removeItem("accessToken");
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    public async get<T, P = any>(
        url: string,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config);
        return response.data;
    }

    public async post<T, U = any, P = any>(
        url: string,
        data?: U,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    public async put<T, U = any, P = any>(
        url: string,
        data?: U,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config);
        return response.data;
    }

    public async delete<T, P = any>(
        url: string,
        config?: ExtendedRequestConfig<P>
    ): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config);
        return response.data;
    }
}

const apiClient = new ApiClient(API_BACKEND_BASE_URL);
export default apiClient;
