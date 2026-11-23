import type { CheckoutProduct } from "@/types/checkout";
import { type ComponentProps } from "react";
import { Checkbox } from "../ui/checkbox"
import { useCheckout } from "@/hooks/use-chechout";
import { useWatch } from "react-hook-form";

interface CheckoutProductItemProps extends ComponentProps<'div'>
{
    item: CheckoutProduct
}

export default function CheckoutProductItem({ item, ...props }: CheckoutProductItemProps)
{
    const { updateCheckoutItemAsync, fetchCourierChargesAsync, fetchShippingCostInfoAsync, checkoutForm } = useCheckout()
    const { control } = checkoutForm;

    const addressId = useWatch({ control, name: "addressId" })
    const transportModeId = useWatch({ control, name: "transportModeId" })
    const shippingProviderId = useWatch({ control, name: "shippingProviderId" })
    const orderItems = useWatch({ control, name: "orderItems" })


    return (
        <div key={item.id} className="flex items-center gap-3" {...props}>
            <Checkbox
                checked={orderItems.includes(item.id)}
                onCheckedChange={async (checked) =>
                {
                    const newValue = checked
                        ? [...orderItems, item.id]
                        : orderItems.filter(x => x !== item.id)
                    checkoutForm.setValue("orderItems", newValue)
                    await updateCheckoutItemAsync({ id: item.id, isCheckout: !!checked })

                    if (transportModeId == "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" && addressId && addressId.value)
                    {
                        await fetchCourierChargesAsync(addressId.value)
                        await fetchShippingCostInfoAsync(addressId.value, shippingProviderId ?? "")
                    }

                }}
            />
            <div className="size-16 shrink-0 overflow-hidden rounded-lg">
                <img
                    loading="lazy"
                    decoding="async"
                    src={item.productImage}
                    alt={item.product}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product}</p>
                <p className="text-xs text-muted-foreground">
                    {item.quantity.toLocaleString()} x {item.noOfUnits} units
                </p>
            </div>
            <p className="text-sm font-medium">Rs{(item.productPrice + item.otherSpecificationPrice)}</p>
        </div>
    )
}
