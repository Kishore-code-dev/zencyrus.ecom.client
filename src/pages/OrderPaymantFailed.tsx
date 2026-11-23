import { useNavigate, useParams } from 'react-router';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderPaymentFailed()
{
    const { orderId = "" } = useParams<Readonly<Partial<{ orderId: string }>>>()
    const navigate = useNavigate();

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-20">
                <div className="mx-auto max-w-lg text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
                        <XCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <h1 className="mt-6 font-display text-3xl font-bold">Payment Failed</h1>
                    <p className="mt-3 text-muted-foreground">
                        We were unable to process your payment. Your order has not been placed. Please check your payment details and try again.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate(`/checkout/${orderId}`)}>
                            Try Again
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/catalog')}>
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}