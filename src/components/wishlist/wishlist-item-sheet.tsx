import { useState, type ComponentProps, type ReactNode } from "react"
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router"
import { useWishList } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface WishlistItemSheetProps extends ComponentProps<typeof Button>
{
  BtnIcon: ReactNode
  label: string
}

export default function WishlistItemSheet({
  BtnIcon = null,
  label = "",
  size = "icon",
  variant = "ghost",
  className,
  ...props
}: WishlistItemSheetProps)
{
  const { wishlistItems, removeWishListItemAsync } = useWishList();
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(className, "relative")}
          {...props}
        >
          {BtnIcon}
          {label && <span>{label}</span>}
          <Badge className="size-5  rounded-full absolute -top-2 -right-2">
            {wishlistItems.length}
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <div className="h-12 flex items-center justify-between pr-10">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <SheetTitle>My Wishlist</SheetTitle>
            </div>
          </div>
          <Separator />
        </SheetHeader>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 overflow-y-auto mt-4">

          {wishlistItems.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Your wishlist is empty
            </div>
          )}

          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 gap-3 p-2.5"
              >
                {/* Product Image */}
                <div className="size-14 col-span-1 rounded-md overflow-hidden">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.productImage}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="col-span-4 flex items-center justify-center gap-2.5">

                  <div className="w-full flex flex-col">
                    <span
                      className="text-xs font-medium text-primary wrap-anywhere cursor-pointer hover:underline"
                      onClick={() =>
                      {
                        setOpen(false);
                        navigate(`/product/${item.productId}/${item.quantity.value}`);
                      }}
                    >
                      {item.productName}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Quantity: {item.quantity.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Price: {item.price}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Turn around days: {item.turnAroundDays}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {/* Remove Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeWishListItemAsync(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>

                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>


      </SheetContent>
    </Sheet>
  );
}