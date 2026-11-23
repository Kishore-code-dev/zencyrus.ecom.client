import { Form } from "@/components/ui/form";
import { api } from "@/config/api";
import { customJobCheckoutSchema, defaultCustomJob, type CustomJobCheckoutSchemaType } from "@/config/custom-job";
import { useApiAction } from "@/hooks/use-api-action";
import type { CustomJob, CustomJobProviderContextValue, CustomJobProviderProps } from "@/types/custom-job";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { createContext, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export const CustomJobProviderContext = createContext<CustomJobProviderContextValue | null>(null)

export default function CustomJobProvider({ children }: CustomJobProviderProps)
{
    const [loading, startTransition] = useTransition()
    const { customJobId = "" } = useParams<Readonly<Partial<{ customJobId: string }>>>()
    const { apiActionAsync } = useApiAction()
    const [customJob, setCustomJob] = useState<CustomJob>(defaultCustomJob)
    const customJobCheckoutForm = useForm<CustomJobCheckoutSchemaType>({
        mode: "onChange",
        defaultValues: {
            addressId: {
                label: "",
                value: ""
            },
            customJobId,
            attachment: [],
            transportModeId: "",
            paymentModeId: "",
            requiredDate: new Date(),
        },
        resolver: zodResolver(customJobCheckoutSchema)
    })

    useEffect(() =>
    {
        startTransition(async () =>
        {
            try
            {
                const response = await api.get(`customquote/getbyid?id=${customJobId}`)
                if (response.status == 200 && response.data)
                {
                    const data = response.data as CustomJob
                    setCustomJob(data)
                }
            }
            catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }

        })

    }, [customJobId])


    return (
        <CustomJobProviderContext.Provider value={{ customJob, customJobCheckoutForm, loading }}>
            <Form {...customJobCheckoutForm}>
                {children}
            </Form>
        </CustomJobProviderContext.Provider>
    )
}
