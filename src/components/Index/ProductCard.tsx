import { useNavigate } from "react-router";
import { Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import WishListToggler from "../wishlist/WishListToggler";
import type { ProductCatlog } from "@/types/product";

interface ProductCardProps
{
  product: ProductCatlog;
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps)
{
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth()

  if (viewMode == "list")
  {
    return (
      <Card className="grid grid-cols-5 h-52 p-0 group overflow-hidden border-border bg-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
        <div className="relative col-span-1 aspect-auto overflow-hidden bg-secondary">
          <img
            loading="lazy"
            decoding="async"
            src={product.productImage.label}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* {product.category.value && (
                <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground">
                  {product.category.label}
                </Badge>
              )} */}
          {isAuthenticated && (
            <WishListToggler productId={product.id} quantityId={product.quantity.value} className="absolute top-2 right-2" />
          )}
        </div>
        <div className="col-span-4 grid grid-cols-1 gap-1">
          <CardContent className="px-5 my-auto">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />

            {/* Meta info */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {product.turnAroundDays}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                Min. {product.quantity.label} units
              </span>
            </div>
          </CardContent>
          <CardFooter className="h-16 flex items-center justify-between border-t borderx-border p-2.5 my-auto">
            <div>
              <span className="text-xs text-muted-foreground">Starting at</span>
              <p className="font-display text-xl font-bold text-foreground space-x-1.5">
                <span>Rs</span>
                {isAuthenticated
                  ? (
                    <>
                      <span className="text-lg text-muted-foreground line-through">{product.basePrice.toFixed(2)}</span>
                      <span>{product.price.toFixed(2)}</span>
                    </>
                  )
                  : <span>{product.basePrice.toFixed(2)}</span>}
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              disabled={!product.isAvalible}
              onClick={() =>
              {
                if (!isAuthenticated)
                {
                  navigate("/auth/login");
                } else
                {
                  navigate(`/product/${product.id}/${product.quantity.value}`);
                }
              }}
            >
              {product.isAvalible ? "Configure" : "Out of stocks"}
            </Button>
          </CardFooter>
        </div>
      </Card>
    )
  }


  return (
    <Card className="pt-0 pb-2 group overflow-hidden border-border bg-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-4/3 overflow-hidden bg-secondary">
        <img
          loading="lazy"
          decoding="async"
          src={product.productImage.label}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isAuthenticated && (
          <WishListToggler productId={product.id} quantityId={product.quantity.value} className="absolute top-2 right-2" />
        )}
      </div>
      <CardContent className="px-5">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />


        {/* Meta info */}
        <div className="mt-4 flex flex-col items-start gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {product.turnAroundDays}
          </span>
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            Min. {product.quantity.label} units
          </span>
        </div>
      </CardContent>
      <CardFooter className="h-fit w-full grid grid-cols-1 gap-2.5 border-t border-border py-0 px-2.5">
        <div>
          <span className="text-xs text-muted-foreground">Starting at</span>
          <p className="font-display text-xl font-bold text-foreground space-x-1.5">
            <span>Rs</span>
            {isAuthenticated
              ? (
                <>
                  <span className="text-lg text-muted-foreground line-through">{product.basePrice.toFixed(2)}</span>
                  <span>{product.price.toFixed(2)}</span>
                </>
              )
              : <span>{product.basePrice.toFixed(2)}</span>}
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() =>
          {
            if (!isAuthenticated)
            {
              navigate("/auth/login");
            } else
            {
              navigate(`/product/${product.id}/${product.quantity.value}`);
            }
          }}
        >
          {product.isAvalible ? "Configure" : "Out of stocks"}
        </Button>
      </CardFooter>
    </Card>
  );
}
