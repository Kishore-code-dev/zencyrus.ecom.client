import { CartContextProvider } from "@/providers/cart-context-provider";
import { useContext } from "react";

export function useCart()
{
    const context = useContext(CartContextProvider);
    if (!context)
    {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}