import type { PropsWithChildren } from "react";
import type { ImageOptionItem, OtherSpecificationPriceOptionItem } from "./common";
import type z from "zod";
import type { addToCartSchema, addToProductDynamicConfigurationSchema } from "@/config/cart";

export interface CartProviderProps extends PropsWithChildren
{

}


export type AddToCartItem = z.infer<typeof addToCartSchema>

export type AddToProductDynamicConfigurationSchema = z.input<typeof addToProductDynamicConfigurationSchema>

export interface QuantityOption
{
    value: string
    label: string
}

export interface CartItem
{
    id: string
    product: string
    optionType: string
    productDescription: string
    productImage: string
    unitPrice: number
    price: number
    quantity: number
    cellCount: number
    designFiles: ImageOptionItem[]
    otherSpecification: string[]
    otherSpecificationOptions: OtherSpecificationPriceOptionItem[]
    instruction: string
    noOfUnits: number
}

export interface UpdateCartItem
{
    id: string
    otherSpecification: string[]
    noOfUnits: number
}


export interface CartInfo
{
    totalItems: number
    totalAmount: number
    totalWalletAmount: number
    creditBalance: number
}

export interface CartContextValue
{
    addToProductDynamicConfigurationAsync: (payload: AddToProductDynamicConfigurationSchema) => Promise<{ isSuccess: boolean }>
    addToCartItemAsync: (payload: AddToCartItem) => Promise<{ isSuccess: boolean }>
    removeToCartItemAsync: (Id: string) => Promise<void>
    updateCartItemAsync: (payload: UpdateCartItem) => Promise<void>
    cartInfo: CartInfo
    loading: boolean
    fetchData: () => Promise<void>
}