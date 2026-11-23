import FallBackSkeleton from "@/components/FallBackSkeleton"
import { api } from "@/config/api"
import { useApiAction } from "@/hooks/use-api-action"
import { AxiosError } from "axios"
import { useCallback, useEffect, useTransition } from "react"
import { useNavigate, useParams } from "react-router"

export default function LogInAsCustomer()
{
    const { customerId = "" } = useParams<Readonly<Partial<{ customerId: string }>>>()
    const { apiActionAsync } = useApiAction()
    const [loading, startTransition] = useTransition()
    const navigate = useNavigate()
    const fetchDataAsync = useCallback(async (customerId: string) =>
    {
        try
        {
            const response = await api.get(`corefuncationality/customer/loginascustomer?id=${customerId}`)
            if (response.status == 200 && response.data)
            {
                await apiActionAsync(response)
                navigate(0)
            }
        } catch (error)
        {
            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }
        }
    }, [customerId])

    useEffect(() =>
    {
        if (!customerId) return;

        startTransition(async () =>
        {
            await fetchDataAsync(customerId)
        })

    }, [customerId])

    return loading
        ? (
            <FallBackSkeleton />
        )
        : (
            <>
            </>
        )
}
