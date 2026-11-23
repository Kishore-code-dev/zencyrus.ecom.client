import axios from "axios";

let baseURL = import.meta.env.VITE_BASE_URL as string

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json; charset=utf-8;",
    },
    withCredentials: true,
});

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
    async function (error)
    {
        const originalRequest = error.config;
        if (error.response.status == 401 && !originalRequest._retry)
        {
            originalRequest._retry = true;
            try
            {
                const response = await axios.post(`${baseURL}/auth/refreshtoken`);
                if (response.status == 200 && response.data)
                {
                    return api(originalRequest);
                }
                if (response.status == 440)
                {
                    localStorage.removeItem(import.meta.env.VITE_AUTH_COOKIE)
                    window.location.href = `/auth/login?redirect=${window.location.pathname}${window.location.search}`
                }
            } catch (error)
            {
                localStorage.removeItem(import.meta.env.VITE_AUTH_COOKIE)
                window.location.href = `/auth/login?redirect=${window.location.pathname}${window.location.search}`
                return Promise.reject(error);
            }
        }
        return Promise.reject(error)
    }
);

export { api }
