import type { PropsWithChildren } from "react";
import type z from "zod";
import type { createWishlistSchema } from "@/config/wishlist";
import type { OptionItem } from "./common";

export interface WishlistProviderProps extends PropsWithChildren
{

}


export type WishlistItem = z.infer<typeof createWishlistSchema>;


export interface WishlistProduct
{
  id: string
  productId: string
  productName: string
  productImage: string
  turnAroundDays: number
  quantity: OptionItem
  price: number
}

export interface WishListContextValue
{
  addToWishListItemAsync: (payload: WishlistItem) => Promise<{ isSuccess: boolean }>
  removeWishListItemAsync: (Id: string) => Promise<void>
  loading: boolean
  wishlistItems: WishlistProduct[]
  fetchData: () => Promise<void>
}