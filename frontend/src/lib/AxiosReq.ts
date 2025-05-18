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

        // this.client.interceptors.response.use(
        //     (response) => response,
        //     (error) => {
        //         const res = error.response;
        //         if (res?.data?.data.clearLocalStorage) {
        //             console.log('Clearing localStorage as instructed by server...');
        //             localStorage.clear(); // ✅ clear all localStorage
        //         }
        //         return Promise.reject(error);
        //     }
        // );

        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const extended = config as ExtendedRequestConfig;
                const requiresAuth = extended.requiresAuth ?? true;

                if (requiresAuth) {
                    const token = localStorage.getItem("accessToken");
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } else {
                    if (config.headers?.Authorization) {
                        delete config.headers.Authorization;
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
                const status = error.response?.status;
                const message = error.response?.data?.message;

                const isTokenExpired =
                    (status === 401 || status === 403) &&
                    message === "Token expired" &&
                    (originalRequest.requiresAuth ?? true) &&
                    !originalRequest._retry;

                if (isTokenExpired) {
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
                        // 👇 NOTE: requiresAuth: false ensures no Authorization header is sent
                        const refreshResponse = await this.client.get<{ accessToken: string }>(
                            URLS.AUTH.REFRESH_TOKEN,
                            {
                                requiresAuth: false,
                            } as ExtendedRequestConfig
                        );


                        if (refreshResponse.status !== 200) {

                            return
                        }

                        const newAccessToken = refreshResponse?.data?.data?.accessToken as any;
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

                        // OPTIONAL: redirect to login
                        window.location.href = "/login";

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
