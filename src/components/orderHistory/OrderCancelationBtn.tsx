import { useCart } from "@/hooks/use-cart"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useState, useTransition } from "react"
import { Button } from "../ui/button"
import { AxiosError } from "axios"
import { useApiAction } from "@/hooks/use-api-action"
import { api } from "@/config/api"


interface OrderCancelationBtnProps
{
    orderItemId: string
    fetchOrderDetailsAsync: () => Promise<void>
}

export default function OrderCancelationBtn({ orderItemId = "", fetchOrderDetailsAsync }: OrderCancelationBtnProps)
{
    const { fetchData } = useCart()
    const [open, setOpen] = useState<boolean>(false)
    const [loading, startTransition] = useTransition()
    const { apiActionAsync } = useApiAction()

    const onCancelAsync = () =>
    {
        startTransition(async () =>
        {
            try
            {
                const response = await api.patch(`order/cancel?id=${orderItemId}`)
                if (response.status == 200 && response.data)
                {
                    await fetchData()
                    await fetchOrderDetailsAsync()
                    await apiActionAsync(response)
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response);
                }
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant='default' size='sm'>
                    Cancel
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this order? This action cannot be undone
                        and any payment made will be processed according to our refund policy.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogCancel disabled={loading}>Go Back</AlertDialogCancel>
                <AlertDialogAction disabled={loading} onClick={onCancelAsync}>Yes, Cancel Order item</AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    )
}