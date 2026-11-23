import { useEffect, useState, useTransition, type ComponentProps, type ReactElement } from "react"
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { useApiAction } from "@/hooks/use-api-action"
import { api } from "@/config/api"
import { AxiosError } from "axios"
import type { CheckoutProduct } from "@/types/checkout"
// import { Spinner } from "../ui/spinner"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart } from "lucide-react"
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router"
import { Badge } from "../ui/badge"
import { viewCart } from "@/analytics/ecommerce"

interface CartItemSheetProps extends ComponentProps<typeof SheetTrigger>
{
    TriggerButton: ReactElement
}

export default function CartItemSheet({
    TriggerButton,
    className,
    ...props
}: CartItemSheetProps)
{

    const cart = useCart()
    const { cartInfo, removeToCartItemAsync } = cart
    const [open, setOpen] = useState<boolean>(false)
    const [loading, startTransication] = useTransition()
    const { apiActionAsync } = useApiAction()
    const [items, setItems] = useState<CheckoutProduct[]>([])
    const navigate = useNavigate();
    const fetchData = () =>
    {
        startTransication(async () =>
        {
            try
            {
                const resposne = await api.get(`cart/getall`)
                if (resposne.status == 200 && resposne.data)
                {
                    setItems(resposne.data || [])
                    viewCart(resposne.data, cartInfo.totalAmount)
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })
    }

    const emptyCartAsync = () =>
    {
        startTransication(async () =>
        {
            try
            {
                const resposne = await api.delete(`cart/empty`)
                if (resposne.status == 200 && resposne.data)
                {
                    setItems([])
                    await cart.fetchData()
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })
    }


    useEffect(() =>
    {
        if (!open) return;
        fetchData()
    }, [open])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild {...props}>
                {TriggerButton}
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <div className="h-12 w-full flex items-center justify-between pr-10">
                        <div className="flex items-center gap-2 ">
                            <ShoppingCart className="h-5 w-5 mx-auto" />
                            <SheetTitle className="ml-0">Cart Preview</SheetTitle>
                        </div>
                        <Badge variant="secondary">{cartInfo.totalItems} items</Badge>
                    </div>
                    <Separator />
                </SheetHeader>
                <div className="grid grid-cols-1 overflow-y-auto">
                    {!loading && (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-6 gap-3 p-2.5">
                                    <div className="col-span-2 rounded-md overflow-hidden">
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src={item.productImage}
                                            alt={item.product}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="col-span-4 grid grid-cols-2 gap-2.5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {item.product}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Qty: {item.quantity} units
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                NoOf units : {item.noOfUnits} units
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-semibold mr-2">
                                                Rs {((item.productPrice + item.otherSpecificationPrice))}
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={async () =>
                                                {
                                                    await removeToCartItemAsync(item.id)
                                                    await fetchData()
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <SheetFooter className="grid grid-cols-1 gap-2.5 border border-t">
                    <div className="w-full space-y-1 text-sm">
                        <div className="flex justify-between text-base font-semibold">
                            <span>Subtotal</span>
                            <span>Rs {cartInfo.totalAmount ?? 0}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full mt-2">
                        <Button className="rounded-xl" variant="destructive" onClick={emptyCartAsync} disabled={loading}>Empty Cart</Button>
                        <Button
                            className="rounded-xl"
                            onClick={() =>
                            {
                                navigate("/cart")
                                setOpen(false)
                            }}>
                            View Cart
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
