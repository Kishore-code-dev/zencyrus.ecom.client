import { ShippingAddressContext } from "@/providers/shipping-address-provider";
import { useContext } from "react";

export function useShippingAddress()
{
    const context = useContext(ShippingAddressContext);
    if (!context)
    {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}