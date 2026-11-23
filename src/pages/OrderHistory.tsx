import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { format } from 'date-fns';
import OrderHistoryHeader from '@/components/orderHistory/OrderHistoryHeader';
import { useAuth } from '@/hooks/use-auth';
import PagedResult from '@/components/paged-result/paged-result';
import { usePagedResult } from '@/hooks/use-paged-result';
import type { OrdersHistory } from '@/types/order-history';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import Toolbar from "@/components/catalog/Toolbar";



function OrderCard({ order, viewMode }: { order: OrdersHistory; viewMode: "grid" | "list" })
{
  return (
    <Card className={viewMode === "list" ? "flex flex-row" : "md:max-h-[255] min-h-fit"}>
      {viewMode === "list" ? (
        <CardContent className="flex items-center w-full px-6 py-4 gap-6">

          {/* LEFT */}
          <div className="flex flex-col w-55">
            <CardTitle className="text-sm font-semibold truncate">
              {order.orderReferenceNumber}
            </CardTitle>

            <CardDescription className="text-xs mt-1">
              <div>Placed on {format(order.orderDate, 'MMM d, yyyy')}</div>
              <div>{order.totalItems} items</div>
            </CardDescription>

            <Badge className="mt-2 w-fit text-xs px-2 py-1">
              {order.status}
            </Badge>
          </div>

          {/* DIVIDER */}
          <div className="hidden md:block h-14 w-px bg-border" />

          {/* MIDDLE */}
          <div className="flex flex-col flex-1  min-w-0">
            <h4 className="text-[11px] uppercase text-muted-foreground mb-1">
              Shipping Details
            </h4>

            <p className="text-sm font-medium truncate">
              {order.addressReferenceName}
            </p>

            <p className="text-xs text-muted-foreground truncate">
              {order.addressLine1} {order.addressLine2}
            </p>

            <p className="text-xs text-muted-foreground truncate">
              {order.city}, {order.state} {order.pinCode}
            </p>

            {order.trackingNumber && (
              <div className="flex items-center gap-1 mt-2 text-xs">
                <Truck className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Tracking:</span>
                <span className="font-medium text-blue-600">
                  {order.trackingNumber}
                </span>
              </div>
            )}
          </div>


          {/* RIGHT */}
          <div className="flex flex-col items-end w-55 shrink-0 ml-auto">
            <div className="text-sm space-y-1 w-full">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>₹ {order.totalAmount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹ {order.shippingAmount}</span>
              </div>

              {order.refundAmount > 0 && (
                <div className="flex justify-between text-destructive font-semibold pt-1">
                  <span>Refund Amount</span>
                  <span>₹ {order.refundAmount}</span>
                </div>)
              }

              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total</span>
                <span>₹ {order.totalAmount - order.refundAmount}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Link to={`/orders/${order.id}`}>
                <Button size="sm" variant="outline">
                  View details
                </Button>
              </Link>

              {order.trackingNumber && (
                <Button
                  size="sm"
                  onClick={() =>
                  {
                    navigator.clipboard.writeText(order.trackingNumber!);
                    window.open(order.trackingUrl, "_blank");
                  }}
                >
                  <Truck className="h-3 w-3 mr-1" />
                  Track
                </Button>
              )}
            </div>
          </div>

        </CardContent>
      ) : (
        <CardContent className="divide-y divide-border">
          <CardHeader className="border-b border-border grid grid-cols-1">
            <div>
              <CardTitle className="text-base font-medium">{order.orderReferenceNumber}</CardTitle>
              <CardDescription className="mt-1 space-y-0.5 text-sm">
                <span className="block">Placed on {format(order.orderDate, 'MMM d, yyyy')}</span>
                <span className="block">{order.totalItems} items</span>
              </CardDescription>
            </div>
            <div>
              <Badge className="rounded-md px-3 py-1 text-xs font-medium">{order.status}</Badge>
            </div>
          </CardHeader>
          {/* Shipping */}
          <div className="space-y-3 py-5 truncate">
            <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground truncate">
              Shipping details
            </h4>
            <div className="rounded-md bg-secondary/50 text-xs px-3.5 py-3 text-wrap wrap-break-word">
              <p className="text-xs font-medium">{order.addressReferenceName}</p>
              <p className="text-xs text-muted-foreground wrap-break-word">{order.addressLine1} {order.addressLine2}</p>
              <p className="text-xs text-muted-foreground">{order.city}, {order.state} {order.pinCode}</p>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-1.5 text-sm">
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Tracking:</span>
                <span className="font-mono font-medium text-blue-600">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 gap-2.5 p-5 px-3.5">
            <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Order summary
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>Rs {(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Rs {(order.shippingAmount)}</span>
              </div>
              {order.refundAmount > 0 && (
                <div className="flex justify-between text-destructive font-semibold pt-1">
                  <span>Refund Amount</span>
                  <span>₹ {order.refundAmount}</span>
                </div>)
              }

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs {(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <CardFooter className='h-16 w-full grid grid-cols-1 p-1'>
            {/* Actions */}
            <div className="ml-auto">
              {/* <Button variant="outline" size="sm" onClick={() => navigate(`/invoice/${order.id}`)}>
              View invoice
            </Button> */}
              <Link to={`/orders/${order.id}`}>
                <Button size='sm' variant='outline'>
                  View details
                </Button>
              </Link>
              {order.trackingNumber && (
                <Button size="sm" onClick={() =>
                {
                  navigator.clipboard.writeText(order.trackingNumber!);
                  window.open(order.trackingUrl, "_blank");
                }}>
                  <Truck className="mr-1.5 h-3.5 w-3.5" />
                  Track package
                </Button>
              )}
            </div>
          </CardFooter>
        </CardContent>
      )}
    </Card>

  );
}

function OrderHistoryCards()
{
    
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { isAuthenticated } = useAuth();
  const { pagedResult } = usePagedResult()
  const navigate = useNavigate();

  if (!isAuthenticated)
  {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <Package className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <p className="text-muted-foreground">
                Please sign in to view your order history.
              </p>
              <Button variant="default" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!pagedResult.items.length)
  {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">Your order is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Start purchasing the product
          </p>
          <Button className="mt-6" onClick={() => navigate('/catalog')}>
            Browse Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <OrderHistoryHeader />
          <Toolbar viewMode={viewMode} setViewMode={setViewMode} />
          <div
            className={
              viewMode === "grid"
                ? "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2.5"
                : "flex flex-col gap-4"
            }
          >
            {(pagedResult.items as unknown as OrdersHistory[]).map(order => (
              <OrderCard key={order.id} order={order} viewMode={viewMode} />
            ))}
          </div>
        </div>
      </main>

    </div>
  );

}

const PAGE_SIZES: number[] = [12, 24, 36, 48, 60] as const

export default function OrderHistory()
{
  return (
    <div className='flex flex-row'>
      <Sidebar />
      <PagedResult
        viewId=''
        path='order'
        pageSize={12}
      >
        <div className='h-fit w-full grid grid-cols-1 gap-2.5 p-2.5'>
          <OrderHistoryCards />
          <div className='ml-auto grid grid-cols-2 gap-2.5'>
            <PagedResult.PageSize pageSizes={PAGE_SIZES} customPageSize />
            <PagedResult.Pagination />
          </div>
        </div>
      </PagedResult>
    </div>
  )
}
