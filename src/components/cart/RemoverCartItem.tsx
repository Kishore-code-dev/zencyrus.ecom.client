import { removeFromCart } from "@/analytics/ecommerce"
import
{
    AlertDialog,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { usePagedResult } from "@/hooks/use-paged-result"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/types/cart"
import { Trash2 } from "lucide-react"
import { useState, type ComponentProps } from "react"

interface RemoverCartItemProps extends ComponentProps<typeof Button>
{
    id: string
    cartItem: CartItem
}

export default function RemoverCartItem({ id, cartItem, className, ...props }: RemoverCartItemProps)
{
    const [open, setOpen] = useState<boolean>(false)
    const { fetchPagedResultAsync, payload } = usePagedResult()
    const { removeToCartItemAsync } = useCart()

    const handleRemove = async () =>
    {
        removeFromCart(cartItem)
        await removeToCartItemAsync(id)
        await fetchPagedResultAsync({ ...payload, pageNumber: 1, pageSize: 10, columnFilters: [] })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className={cn(className)} {...props}>
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you want to remove this item from the cart?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRemove}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}