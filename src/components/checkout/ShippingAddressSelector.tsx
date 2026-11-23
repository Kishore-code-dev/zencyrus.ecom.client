import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useShippingAddress } from "@/hooks/use-shipping-address";
import { MapPinPlus } from "lucide-react";
import { Separator } from "../ui/separator";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem } from "../ui/form";
import { useCheckout } from "@/hooks/use-chechout";

interface ShippingAddressSelectorProps extends ComponentProps<'div'>
{

}

export default function ShippingAddressSelector({ className, ...props }: ShippingAddressSelectorProps)
{
    const { mode, setMode } = useShippingAddress()
    const { checkoutForm } = useCheckout()
    return (
        <div className={cn("my-4 grid grid-cols-1 gap-5", className)} {...props}>
            <div className="flex gap-3 items-center w-full">
                <div className="flex-1">
                    <FormField
                        control={checkoutForm.control}
                        name="addressId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="Type to search address"
                                        path="customeraddresses/search?searchString"
                                        disabled={mode == "NEW"}
                                        mode="dynamic"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="button"
                    onClick={() =>
                    {
                        setMode("NEW")
                        checkoutForm.setValue("addressId", { label: "", value: "" })
                    }}
                >
                    <MapPinPlus />
                    Add address
                </Button>
            </div>
            <Separator />
        </div>
    );
}