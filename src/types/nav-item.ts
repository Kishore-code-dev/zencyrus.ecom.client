import type { OptionItem, ProductOptionItem } from "./common";

export interface ProductNavItem
{
    id: string
    name: string
    isShown: boolean
    subNavItem: SubNavItem[];
    // isDynamicConfiguration: boolean;
}

export interface SubNavItem
{
    classification: OptionItem
    menus: ProductNavMenuItem[]
}

export interface ProductNavMenuItem
{
    alias: string
    isShown: boolean
    isNewArrival: boolean
    isDynamicConfiguration: boolean
    productId: string
    products: ProductOptionItem[]
}


