import type { ComponentProps } from 'react';
import { Button } from '../ui/button'
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

interface OrderSummaryProps extends ComponentProps<'div'>
{
}


const OrderSummary = ({ className, ...props }: OrderSummaryProps) =>
{
  const navigate = useNavigate();
  const { cartInfo } = useCart()

  return (
    <div className={cn(className, "w-full")} {...props}>
      <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h2 className="font-display text-xl font-bold">Order Summary</h2>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span>{cartInfo.totalAmount}</span>
          </div>
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>(Pick-up from Maruthi - Own Pick-Up)</span>
          </div> */}
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (est.)</span>
            <span></span>
          </div> */}
          <div className="border-t border-border pt-4 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold">{cartInfo.totalAmount}</span>
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          className="mt-6 w-full"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </Button>
        {/* <div className="mt-6 rounded-lg bg-secondary p-4">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Secure checkout powered by Stripe
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default OrderSummary