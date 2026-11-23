import type { ReactNode } from "react";
import z from "zod";

const optionItemSchmea = z.object({
    label: z.string(),
    value: z.string(),
});

const formSchema = z
    .object({
        fullName: z.string().min(3, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        mobileNo: z
            .string()
            .min(10, "Mobile number must be 10 digits")
            .regex(/^[0-9]+$/, "Only numbers allowed"),
        companyName: z.string().min(2, "Company name is required"),
        gstNumber: z
            .string()
            .length(15, "GST number must be 15 characters")
            .regex(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
                "Invalid GST number format",
            )
            .optional(),
        addressLine1: z.string().min(5, "Address1 is required"),
        addressLine2: z.string().optional(),
        pincodeId: optionItemSchmea.refine((item) => !!item.value, {
            message: "Pincode is required",
        }),
        countryId: optionItemSchmea.refine((item) => !!item.value, {
            message: "Country is required",
        }),
        districtId: optionItemSchmea.refine((item) => !!item.value, {
            message: "District is required",
        }),
        stateId: optionItemSchmea.refine((item) => !!item.value, {
            message: "State is required",
        }),
        secondaryMobileNo: z.string().optional(),
        cityId: optionItemSchmea.optional(),
        referralCodeId: optionItemSchmea.optional(),
        shopBannerFile: z.array(
            z
                .instanceof(File, { message: "Company Banner is required" })
                .refine((file) => file.size <= 5 * 1024 * 1024, {
                    message: "Banner max size is 5MB",
                }),
        ),
        visitingCardFile: z.array(
            z
                .instanceof(File, { message: "Visiting Card is required" })
                .refine((file) => file.size <= 5 * 1024 * 1024, {
                    message: "Visiting Card max size is 5MB",
                }),
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export interface AuthUser {
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
}

export type AuthType = "email" | "google";

export interface AuthBase {
    email: string;
    password: string;
    idToken?: string;
}

export interface SignIn extends AuthBase {}

export interface SignUp extends z.infer<typeof formSchema> {}
export interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    signInAsync: (payload: SignIn) => Promise<boolean>;
    signUpAsync: (payload: SignUp) => Promise<void>;
    signOutAsync: () => Promise<void>;
}
