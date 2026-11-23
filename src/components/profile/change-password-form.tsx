import { Form } from '@/components/ui/form'
import { api } from '@/config/api'
import { useApiAction } from '@/hooks/use-api-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import z from 'zod'
import ProfileFooter from './ProfileFooter'
import { useAuth } from '@/hooks/use-auth'
import { X } from "lucide-react";

const formSchema = z.object({
    id: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    email: z.string(),
});

type Props = {
    onCancel?: () => void;
};


type FormSchemaType = z.infer<typeof formSchema>

export default function ChangePasswordForm({ onCancel }: Props)
{
    const { securityKey = "" } = useParams()
    const { apiActionAsync } = useApiAction()
    const form = useForm<FormSchemaType>({
        defaultValues: {
            id: "",
            firstName: "",
            lastName: "",
            fullName: "",
            email: "",
        },
        mode: "onChange",
        resolver: zodResolver(formSchema)
    })
    const { handleSubmit } = form;


    const onSubmitAsync = async (payload: FormSchemaType) =>
    {
        try
        {
            const response = await api.patch(`/auth/change-password`, { ...payload, securityKey })
            if (response.status == 200 && response.data)
            {
                await apiActionAsync(response)
            }
        } catch (error)
        {
            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }
        }
    }

    const { user } = useAuth();

    useEffect(() =>
    {
        (async () =>
        {
            try
            {
                const response = await api.post(`/auth/getprofile`, { email: user ? user.email : "" })
                if (response.status === 200 && response.data)
                {
                    form.reset(response.data)
                }
                await apiActionAsync(response)
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })()
    }, [user])

    return (

        <div className="w-full flex justify-center items-center">

            <div className="relative w-full max-w-2xl bg-background p-4 rounded-lg shadow-lg">

                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="absolute top-3 z-10 right-3 p-1 rounded-md hover:bg-accent"
                    >
                        <X size={18} />
                    </button>
                )}

                <Form {...form}>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmitAsync)}>
                        <ProfileFooter onCancel={onCancel} />
                    </form>
                </Form>

            </div>

        </div>
    );
}