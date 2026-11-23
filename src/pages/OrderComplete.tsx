import { useNavigate, useParams, useSearchParams } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function OrderComplete()
{
    const { orderId = "" } = useParams<Readonly<Partial<{ orderId: string }>>>()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const referenceNo = searchParams.get('referenceNo')

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-20">
                <div className="mx-auto max-w-lg text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                        <CheckCircle className="h-10 w-10 text-accent" />
                    </div>
                    <h1 className="mt-6 font-display text-3xl font-bold">Order Confirmed!</h1>
                    <p className="mt-3 text-muted-foreground">
                        Thank you for your order. We've sent a confirmation email with your order details and tracking information.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate('/catalog')}>
                            Continue Shopping
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/orders/${orderId}`)}>
                            Track Order {referenceNo}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
