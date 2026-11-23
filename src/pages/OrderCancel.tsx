import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useNavigate } from 'react-router';
export default function OrderCancel()
{

    const navigate = useNavigate();
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-20">
                <div className="mx-auto max-w-lg text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                        <CircleX className="h-10 w-10 text-accent" />
                    </div>
                    <h1 className="mt-6 font-display text-3xl font-bold">Order Cancelled!</h1>
                    <p className="mt-3 text-muted-foreground">
                        Your Transaction has been cancelled. View the Order History
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate('/orders')}>
                            Order History
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}
