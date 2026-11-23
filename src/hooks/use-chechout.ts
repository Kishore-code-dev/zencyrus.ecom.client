import { CheckoutContextProvider } from "@/providers/check-out-provider";
import { useContext } from "react";

export function useCheckout()
{
    const context = useContext(CheckoutContextProvider);
    if (!context)
    {
        throw new Error("useCheckout must be used within CheckoutProvider");
    }
    return context;
}