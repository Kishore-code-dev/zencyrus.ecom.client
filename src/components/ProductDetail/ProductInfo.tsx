import { Clock, Package, Truck } from "lucide-react";

const ProductInfo = ({ product }: any) =>
{
  if (!product) return;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <Clock className="mx-auto h-5 w-5 text-primary" />
        <p className="mt-2 text-sm font-medium">
          {`${product.turnAroundDays}`}
        </p>
        <p className="text-xs text-muted-foreground">Turnaround</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <Package className="mx-auto h-5 w-5 text-primary" />
        <p className="mt-2 text-sm font-medium">{product?.quantity?.label}</p>
        <p className="text-xs text-muted-foreground">Min. Order</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <Truck className="mx-auto h-5 w-5 text-primary" />
        <p className="mt-2 text-sm font-medium">Shipping</p>
        <p className="text-xs text-muted-foreground">All over india</p>
      </div>
    </div>
  );
};

export default ProductInfo;
