import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { removeStoredAuthUser } from "./auth-storage";
import {
  demoProducts,
  demoOrders,
  demoWalletTransactions,
  demoWalletBalance,
  demoUserProfile,
  demoHeroBanners,
  demoNavItems,
  demoCategoryGridItems,
} from "@/data/demo-data";

const baseURL = import.meta.env.VITE_BASE_URL as string

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json; charset=utf-8;",
    },
    withCredentials: true,
});

// ============================================================
// DUMMY DATA MOCK INTERCEPTOR — No backend required for demo
// Returns realistic dummy responses for every API endpoint
// ============================================================

function isNetworkError(error: unknown): boolean
{
    if (!axios.isAxiosError(error)) return false;
    return !error.response;
}

function dummyResponse(data: any, status = 200): AxiosResponse
{
    return {
        data,
        status,
        statusText: "OK",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse;
}

api.interceptors.response.use(
    (response) => response,
    async function (error: unknown)
    {
        // If backend is unreachable, return dummy data based on URL path
        if (isNetworkError(error))
        {
            const config: any = (error as any).config;
            const url: string = config?.url || "";
            const method: string = (config?.method || "get").toLowerCase();
            const reqData: any = config?.data || {};

            // Auth endpoints
            if (url.includes("/auth/signin") && method === "post")
            {
                return dummyResponse({
                    isSuccess: true,
                    message: { category: "success", description: "Signed in successfully" },
                    data: demoUserProfile,
                    actions: [
                        {
                            type: "LOCALSTORAGE",
                            step: {
                                variant: "SET",
                                propertyName: import.meta.env.VITE_AUTH_COOKIE || "shree_maruthi_printers_auth",
                                propertyValue: demoUserProfile,
                            },
                        },
                        {
                            type: "NAVIGATION",
                            step: { variant: "INTERNAL", baseUrl: "", path: "/" },
                        },
                    ],
                });
            }

            if (url.includes("/auth/signup") && method === "post")
            {
                return dummyResponse({
                    isSuccess: true,
                    message: { category: "success", description: "Account created successfully" },
                    data: {},
                    actions: [
                        {
                            type: "NAVIGATION",
                            step: { variant: "INTERNAL", baseUrl: "", path: "/auth/login" },
                        },
                    ],
                });
            }

            if (url.includes("/auth/signout") && method === "post")
            {
                return dummyResponse({
                    isSuccess: true,
                    message: { category: "success", description: "Signed out" },
                    data: {},
                    actions: [],
                });
            }

            if (url.includes("/auth/refreshtoken") && method === "post")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: { accessToken: "dummy-token" },
                    actions: [],
                });
            }

            if (url.includes("/auth/getprofile") && method === "post")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: demoUserProfile,
                    actions: [],
                });
            }

            // Hero banners
            if (url.includes("/cmsherobanner/getall") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: demoHeroBanners,
                    actions: [],
                });
            }

            // Products / catalog
            if (url.includes("/product/pagedresult") && method === "post")
            {
                const search = (reqData.searchString || "").toLowerCase();
                const pageSize = reqData.pageSize || 10;
                const pageNumber = reqData.pageNumber || 1;
                let filtered = demoProducts.filter(
                    (p) =>
                        p.name.toLowerCase().includes(search) ||
                        p.description.toLowerCase().includes(search)
                );
                const start = (pageNumber - 1) * pageSize;
                const paginated = filtered.slice(start, start + pageSize);
                const totalPages = Math.ceil(filtered.length / pageSize) || 1;

                return dummyResponse({
                    isSuccess: true,
                    data: {
                        items: paginated,
                        totalItems: filtered.length,
                        totalPages,
                        pageNumber,
                        pageSize,
                        maxNavigationPages: 5,
                        startPage: 1,
                        endPage: Math.min(totalPages, 5),
                        pageNumbers: Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => i + 1
                        ),
                    },
                    actions: [],
                });
            }

            // Product detail by ID
            if (url.includes("/product/getbyid") && method === "get")
            {
                const product = demoProducts.find((p) => p.id === reqData.id);
                if (product)
                {
                    return dummyResponse({
                        isSuccess: true,
                        data: {
                            ...product,
                            attachments: [],
                        },
                        actions: [],
                    });
                }
                return dummyResponse({
                    isSuccess: false,
                    data: null,
                    message: { category: "error", description: "Product not found" },
                    actions: [],
                }, 404);
            }

            // Dynamic configuration
            if (url.includes("/product/dynamicconfiguration") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: {
                        id: reqData.id || "prod-001",
                        name: "Custom Product",
                        description: "Customizable product configuration",
                        productImage: { label: "/assets/business-cards.jpg", value: "1" },
                        producType: { label: "Standard", value: "standard" },
                        classification: { label: "Printing", value: "printing" },
                        gsm: [{ label: "100 GSM", value: "gsm1" }],
                        media: [{ label: "Paper", value: "media1" }],
                        lamination: [{ label: "Matte", value: "lam1" }],
                        printingSide: [{ label: "Single Side", value: "side1" }],
                        finishSize: [{ height: 210, width: 297 }],
                        quantity: [{ label: "100", value: "q1" }],
                        foilSide: [],
                        foilType: [],
                        coverType: [],
                        pad: [],
                        dieCut: [],
                        spotUV: [],
                        attachments: [],
                        otherSpecifications: [],
                        pouch: [],
                        additionProcessing: [],
                        fileFinishing: [],
                        optionVisibility: {
                            isGsm: true,
                            isMedia: false,
                            isLamination: true,
                            isPrintingSide: false,
                            isFoilSide: false,
                            isFoilType: false,
                            isSpotUV: false,
                            isPad: false,
                            isPouch: false,
                            isDiecut: false,
                            isQuantity: true,
                            isFinishSize: true,
                            isCoverType: false,
                            isFileFinishing: false,
                        },
                        uploadDimensions: [{ height: 210, width: 297 }],
                    },
                    actions: [],
                });
            }

            // Nav items (menu)
            if (url.includes("/navitem/getall") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: demoNavItems,
                    actions: [],
                });
            }

            // Category grid
            if (url.includes("/producttype/getall") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: demoCategoryGridItems,
                    actions: [],
                });
            }

            // Cart
            if (url.includes("/cart/getall") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: { items: [], totalItems: 0, totalAmount: 0 },
                    actions: [],
                });
            }

            if (url.includes("/cart/info") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: { items: [], totalItems: 0, totalAmount: 0, totalWalletAmount: demoWalletBalance },
                    actions: [],
                });
            }

            // Wishlist
            if (url.includes("/mywishlist/getall") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: [],
                    actions: [],
                });
            }

            // Orders
            if (url.includes("/order/pagedresult") && method === "post")
            {
                const pageSize = reqData.pageSize || 10;
                const pageNumber = reqData.pageNumber || 1;
                const start = (pageNumber - 1) * pageSize;
                const paginated = demoOrders.slice(start, start + pageSize);
                const totalPages = Math.ceil(demoOrders.length / pageSize) || 1;

                return dummyResponse({
                    isSuccess: true,
                    data: {
                        items: paginated,
                        totalItems: demoOrders.length,
                        totalPages,
                        pageNumber,
                        pageSize,
                        maxNavigationPages: 5,
                        startPage: 1,
                        endPage: Math.min(totalPages, 5),
                        pageNumbers: Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => i + 1
                        ),
                    },
                    actions: [],
                });
            }

            // Wallet
            if (url.includes("/wallet/info") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: {
                        currentBalance: demoWalletBalance,
                        totalAddedFund: 10000,
                        totalSpendFund: 5897,
                    },
                    actions: [],
                });
            }

            if (url.includes("/wallettopups") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: { items: demoWalletTransactions, totalItems: demoWalletTransactions.length },
                    actions: [],
                });
            }

            // User profile
            if (url.includes("/users/getdetails") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: {
                        payload: {
                            email: demoUserProfile.email,
                            companyName: demoUserProfile.company,
                            gstNumber: "GST27ABCDE1234F1Z5",
                            memberSince: demoUserProfile.createdAt.toISOString(),
                            status: "Active",
                            mobileNo: "+91 9876543210",
                            addressLine1: demoUserProfile.address.address,
                            addressLine2: "",
                            country: "India",
                            city: demoUserProfile.address.city,
                            state: demoUserProfile.address.state,
                            district: "Coimbatore",
                            pincode: demoUserProfile.address.zip,
                            totalOrders: 5,
                            walletBalance: demoUserProfile.walletBalance,
                            activeQuotes: 0,
                        },
                    },
                    actions: [],
                });
            }

            // Customer addresses
            if (url.includes("/customeraddresses") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: [],
                    actions: [],
                });
            }

            // Data grid config
            if (url.includes("views/config") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: {
                        mode: "DEFAULT_DATA_GRID",
                        title: "Data Grid",
                        description: "",
                        submissionUrl: "",
                        permissions: ["CREATE", "UPDATE", "DELETE", "VIEW_SINGLE_ROW"],
                        columns: [],
                        objectId: "",
                    },
                    actions: [],
                });
            }

            // Custom quote
            if (url.includes("/otherspecifcation/getall") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: [],
                    actions: [],
                });
            }

            // Checkout
            if (url.includes("/checkout/info") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: { totalAmount: 0, items: [], shippingCharges: 0 },
                    actions: [],
                });
            }

            if (url.includes("/checkout/couriercharges") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: { charges: 50, estimatedDays: "2-3 days" },
                    actions: [],
                });
            }

            // Custom job / quote
            if (url.includes("/customquote/getbyid") && method === "get")
            {
                return dummyResponse({
                    isSuccess: true,
                    data: {},
                    actions: [],
                });
            }

            // Generic placeholder for anything else
            return dummyResponse({
                isSuccess: true,
                data: {},
                message: { category: "success", description: "Operation completed" },
                actions: [],
            });
        }

        // Handle 401 auth errors gracefully (no redirect loop in demo)
        if (axios.isAxiosError(error))
        {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
            const status = error.response?.status;

            if (status === 401 && originalRequest && !originalRequest._retry)
            {
                originalRequest._retry = true;
                removeStoredAuthUser();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// ============================================================

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

export { api }
