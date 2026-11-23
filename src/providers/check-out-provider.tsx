import { api } from "@/config/api";
import { checkoutFormSchema, type CheckoutFormSchemaType } from "@/config/checkout";
import { useApiAction } from "@/hooks/use-api-action";
import { useShippingAddress } from "@/hooks/use-shipping-address";
import { type CheckoutProduct, type CheckoutInfo, type CheckoutProviderProps, type UpdateCheckoutItem, type CheckoutContextType } from "@/types/checkout";
import type { PriceOptionItem } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { createContext, useState } from "react";
import { useForm, useWatch } from "react-hook-form";


export const CheckoutContextProvider = createContext<CheckoutContextType | null>(null)


export default function CheckoutProvider({ children }: CheckoutProviderProps)
{
    const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>({
        totalAmount: 0,
        totalWalletAmount: 0,
        totalItemToCheckout: 0,
        totalShippingAmount: 0
    })
    const [courier, setCourier] = useState<PriceOptionItem[]>([])
    const [items, setItems] = useState<CheckoutProduct[]>([])
    const { apiActionAsync } = useApiAction()
    const [loading, setLoading] = useState<boolean>(false)
    const { shippingForm } = useShippingAddress()

    const checkoutForm = useForm<CheckoutFormSchemaType>({
        defaultValues: {
            addressId: {
                label: "",
                value: ""
            },
            customerId: "",
            paymentModeId: "6e41261d-2f07-880f-e86e-867213454d82",
            shippingProviderId: "",
            // transportModeId: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c",
            transportModeId: "",
            orderItems: []
        },
        mode: "onChange",
        resolver: zodResolver(checkoutFormSchema)
    })

    const addressId = useWatch({
        control: checkoutForm.control,
        name: "addressId"
    })

    const shippingProviderId = useWatch({ control: shippingForm.control, name: "shippingProviderId" })


    const fetchShippingCostInfoAsync = async (addressId: string, shippingProviderId: string) =>
    {
        try
        {
            const resposne = await api.get(`checkout/info?addressId=${addressId}&shippingProviderId=${shippingProviderId}`)
            if (resposne.status == 200 && resposne.data)
            {
                setCheckoutInfo(resposne.data)
            }
        } catch (error)
        {

            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }

        }
    }

    const fetchCourierChargesAsync = async (addressId: string) =>
    {
        try
        {
            const resposne = await api.get(`checkout/couriercharges?addressId=${addressId}`)
            if (resposne.status == 200 && resposne.data)
            {
                setCourier(resposne.data || [])
            }
        } catch (error)
        {

            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }

        }
    }

    const fetchCheckoutInfoAsync = async () =>
    {
        try
        {
            const resposne = await api.get(`checkout/info?addressId=${addressId && addressId.value ? addressId.value : ""}&shippingProviderId=${shippingProviderId ?? ""}`)
            if (resposne.status == 200 && resposne.data)
            {
                setCheckoutInfo(resposne.data)
            }
        } catch (error)
        {

            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }
        }
    }

    const updateCheckoutItemAsync = async (payload: UpdateCheckoutItem) =>
    {
        try
        {
            const resposne = await api.post(`checkout/updatecheckoutitem`, payload)
            if (resposne.status == 200 && resposne.data)
            {
                await fetchCheckoutInfoAsync()
            }
        } catch (error)
        {

            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }
        }
    }

    const fetchCheckoutProductAsync = async () =>
    {
        try
        {
            setLoading(true)
            const resposne = await api.get(`checkout/getcheckoutproduct`)
            if (resposne.status == 200 && resposne.data)
            {
                setItems(resposne.data)
                checkoutForm.setValue("orderItems", ((resposne.data || []) as CheckoutProduct[])
                    .filter(x => x.isCheckout)
                    .map(x => x.id))
            }
        } catch (error)
        {

            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }

        }
        finally
        {
            setLoading(false)
            try
            {
                const response = await api.get(`customeraddresses/getbillingaddress`)
                if (response.status == 200 && response.data)
                {
                    if (response.data.value)
                    {
                        checkoutForm.setValue("addressId", response.data)
                    }
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        }
    }

    return (
        <CheckoutContextProvider.Provider
            value={{
                items,
                loading,
                checkoutInfo,
                courier,
                fetchCheckoutInfoAsync,
                fetchShippingCostInfoAsync,
                fetchCourierChargesAsync,
                fetchCheckoutProductAsync,
                updateCheckoutItemAsync,
                checkoutForm
            }}
        >
            {children}
        </CheckoutContextProvider.Provider>
    )
}
