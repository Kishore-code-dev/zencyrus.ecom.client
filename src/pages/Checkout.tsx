import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShippingAddressProvider from '@/providers/shipping-address-provider';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import CheckoutProvider from '@/providers/check-out-provider';

export default function Checkout()
{
  const navigate = useNavigate();

  return (
    <ShippingAddressProvider>
      <CheckoutProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              className="mb-6"
              type='button'
              onClick={() => navigate('/cart')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>

            <h1 className="font-display text-3xl font-bold">Checkout</h1>

            <div className="my-5 grid md:grid-cols-8 grid-cols-1 gap-5">
              {/* Checkout Form */}
              <div className="md:col-span-5">
                {/* Shipping Address */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <ShippingAddressForm />
                </div>
              </div>

              {/* Payment Method */}
              <PaymentMethod className="md:col-span-3" />
            </div>
          </div>
        </div>
      </CheckoutProvider>
    </ShippingAddressProvider>
  );
}
