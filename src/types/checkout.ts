import type { checkoutFormSchema } from "@/config/checkout";
import type { PropsWithChildren } from "react";
import type z from "zod";
import type { PriceOptionItem } from "./common";
import type { UseFormReturn } from "react-hook-form";
export interface CheckoutProduct
{
    id: string
    product: string
    productImage: string
    quantity: string
    noOfUnits: number
    productPrice: number
    otherSpecificationPrice: number
    isCheckout: boolean
}

export interface UpdateCheckoutItem
{
    id: string
    isCheckout: boolean
}

export interface CheckoutInfo
{
    totalAmount: number
    totalWalletAmount: number
    totalItemToCheckout: number
    totalShippingAmount: number
}

export type CheckoutFormSchemaType = z.infer<typeof checkoutFormSchema>

export interface CheckoutProviderProps extends PropsWithChildren
{

}

export interface CheckoutContextType
{
    loading: boolean
    items: CheckoutProduct[]
    checkoutInfo: CheckoutInfo
    courier: PriceOptionItem[]
    fetchCheckoutInfoAsync: () => Promise<void>
    fetchShippingCostInfoAsync: (addressId: string, shippingProviderId: string) => Promise<void>
    fetchCourierChargesAsync: (addressId: string) => Promise<void>
    fetchCheckoutProductAsync: () => Promise<void>
    updateCheckoutItemAsync: (payload: UpdateCheckoutItem) => Promise<void>
    checkoutForm: UseFormReturn<CheckoutFormSchemaType>
}