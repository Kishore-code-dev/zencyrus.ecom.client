import type { CheckoutProduct } from "@/types/checkout"
import { type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import CheckoutProductItem from "./CheckoutProductItem"
import { useCheckout } from "@/hooks/use-chechout"
import { Skeleton } from "../ui/skeleton"

interface CheckoutProductProps extends ComponentProps<'div'>
{

}

export default function CheckoutProduct({ className, ...props }: CheckoutProductProps)
{
    const { loading, items } = useCheckout()

    return (
        <div className={cn("grid grid-cols-1 gap-2.5 max-h-80 overflow-y-auto p-2", className)} {...props}>
            {loading
                ? (
                    <div className="grid grid-cols-1 gap-2.5">
                        <Skeleton className="h-12 w-full rounded-md" />
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>
                )
                : (items.map((item) => (
                    <CheckoutProductItem key={item.id} item={item} />
                )))}
        </div>
    )
}
