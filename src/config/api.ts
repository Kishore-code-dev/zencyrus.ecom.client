import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { removeStoredAuthUser } from "./auth-storage";

const baseURL = import.meta.env.VITE_BASE_URL as string

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json; charset=utf-8;",
    },
    withCredentials: true,
});

type RetriableRequest = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshRequest: Promise<AxiosResponse> | null = null;

function clearAuthSession(): void
{
    removeStoredAuthUser();

    if (window.location.pathname !== "/auth/login")
    {
        const redirect = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
    }
}

function refreshAuthToken(): Promise<AxiosResponse>
{
    if (!refreshRequest)
    {
        const refreshUrl = `${baseURL.replace(/\/+$/, "")}/auth/refreshtoken`;

        refreshRequest = axios.post(refreshUrl, undefined, {
            withCredentials: true,
            headers: {
                "Accept": "application/json",
            },
        }).finally(() =>
        {
            refreshRequest = null;
        });
    }

    return refreshRequest;
}

api.interceptors.request.use(
    function (config)
    {
        return config;
    },
    function (error)
    {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async function (error: unknown)
    {
        if (!axios.isAxiosError(error))
        {
            return Promise.reject(error);
        }

        const originalRequest = error.config as RetriableRequest | undefined;
        const status = error.response?.status;

        if (status !== 401 || !originalRequest)
        {
            return Promise.reject(error);
        }

        if (originalRequest._retry)
        {
            clearAuthSession();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try
        {
            const response = await refreshAuthToken();

            if (response.status === 200)
            {
                return api(originalRequest);
            }
        } catch (refreshError)
        {
            const refreshStatus = axios.isAxiosError(refreshError)
                ? refreshError.response?.status
                : undefined;

            // Only an explicit authentication rejection invalidates the session.
            // A temporary network failure must not sign the user out.
            if (refreshStatus === 401 || refreshStatus === 403 || refreshStatus === 440)
            {
                clearAuthSession();
            }

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export { api }
