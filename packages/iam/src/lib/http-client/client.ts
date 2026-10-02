import { create, AxiosInstance, AxiosError, AxiosResponse } from 'axios';

export type HttpClient = AxiosInstance;
export interface HttpClientConfig {
    baseURL: string;
}

const responseInterceptor = (response: AxiosResponse) => response.data;
const errorInterceptor = (error: AxiosError) => {
    console.error(error);
    throw error;
};

export const createHttpClient = (config: HttpClientConfig): HttpClient => {
    const instance = create({
        baseURL: config.baseURL,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        timeout: 10000,
    });

    instance.interceptors.request.use((config) => ({ ...config }));
    instance.interceptors.response.use(responseInterceptor, errorInterceptor);
    return instance;
};
