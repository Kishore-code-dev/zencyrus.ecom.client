import { WishListContextProvider } from "@/providers/wishlist-context-provider";
import { useContext } from "react";

export function useWishList()
{
    const context = useContext(WishListContextProvider);
    if (!context)
    {
        throw new Error("useWishList must be used within WishListProvider");
    }
    return context;
}