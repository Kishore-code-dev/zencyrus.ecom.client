import { useNavigate } from 'react-router';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from "@/hooks/use-cart";
import CartItems from '@/components/cart/CartItems';
import OrderSummary from '@/components/cart/OrderSummary';
import { useAuth } from '@/hooks/use-auth';
import PagedResult from '@/components/paged-result/paged-result';

export default function Cart()
{
  const navigate = useNavigate();
  const { cartInfo } = useCart();
  const { isAuthenticated } = useAuth();

  // const itemsWithoutDesign = items.filter((item) => !item.designFile);

  if (!isAuthenticated)
  {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">Sign in to view your cart</h1>
          <p className="mt-2 text-muted-foreground">
            Please sign in to access your shopping cart
          </p>
          <Button className="mt-6" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }


  if (!cartInfo.totalItems)
  {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Start adding products to your cart
          </p>
          <Button className="mt-6" onClick={() => navigate('/catalog')}>
            Browse Catalog
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/catalog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>

        <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">{cartInfo.totalItems} item(s) in your cart</p>

        <PagedResult
          viewId=''
          path='cart'
        >
          <section className='grid grid-cols-1 md:grid-cols-5 gap-2.5'>
            <div className="grid grid-cols-1 md:col-span-3">
              <CartItems />
            </div>
            <OrderSummary className="col-span-2" />
          </section>
          <PagedResult.Pagination className="ml-auto my-2.5" />
        </PagedResult>

      </div>
    </div >
  );
}