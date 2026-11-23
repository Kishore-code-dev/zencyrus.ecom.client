import { useWishList } from "@/hooks/use-wishlist";
import { useMemo, type ComponentProps } from "react";
import { Button } from "../ui/button";
import { Heart, HeartPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WishListTogglerProps extends ComponentProps<typeof Button>
{
    productId: string
    quantityId: string
}


export default function WishListToggler({ className, productId = "", quantityId = "", ...props }: WishListTogglerProps)
{
    const { wishlistItems, addToWishListItemAsync, removeWishListItemAsync } = useWishList()

    const isWishlisted = useMemo(() => wishlistItems.find((item) => item.productId === productId && item.quantity.value == quantityId), [productId, wishlistItems.length]);

    const handleWishlist = async (e: React.MouseEvent) =>
    {
        e.stopPropagation();

        if (isWishlisted)
        {
            await removeWishListItemAsync(isWishlisted.id)
            toast.success("Item removed from wishlist")
        }
        else
        {
            await addToWishListItemAsync({ productId, quantityId })
            toast.success("Item added to wishlist")
        }
    };

    return (
        <Button
            type="button"
            size='icon'
            variant='ghost'
            className={cn(className, "bg-transparent!")}
            onClick={handleWishlist}
            {...props}
        >
            {isWishlisted
                ? (<Heart className="size-6 text-red-500 fill-red-500" />)
                : (<HeartPlus className="size-6 text-white" />)}
        </Button>
    )
}
