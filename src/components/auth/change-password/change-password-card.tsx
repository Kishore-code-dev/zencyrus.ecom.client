import AppLogo from '@/components/app-logo/app-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/config/api'
import { useApiAction } from '@/hooks/use-api-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Lock, Mail, User } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import z from 'zod'

const formSchema = z.object({
    id: z.string().optional(),
    fullName: z.string(),
    email: z.string(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .refine((password) =>
        {
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[^a-zA-Z0-9]/.test(password);
            const criteriaMet = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
            return criteriaMet >= 3;
        }, 'Password must contain at least 3 of the following: lowercase letter, uppercase letter, number, or special character'),
    confirmPassword: z.string()
        .min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormSchemaType = z.infer<typeof formSchema>

export default function ChangePasswordCard()
{
    const { securityKey = "" } = useParams()
    const { apiActionAsync } = useApiAction()
    const form = useForm<FormSchemaType>({
        defaultValues: {
            id: "",
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onChange",
        resolver: zodResolver(formSchema)
    })
    const { handleSubmit, control, formState } = form;

    useEffect(() =>
    {
        (async () =>
        {
            if (!securityKey) return;
            try
            {
                const response = await api.get(`/auth/getuserinfo?token=${securityKey}`)
                if (response.status === 200 && response.data && 'isSuccess' in response.data && response.data.isSuccess)
                {
                    form.reset(response.data.payload)
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
    }, [securityKey])

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


    return (
        <div className='h-screen w-full grid'>
            <Card className="w-full max-w-md rounded-lg shadow-lg m-auto">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center">
                        <AppLogo />
                    </div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                        Reset Your Password
                    </CardTitle>
                    <CardDescription className="text-base">
                        Create a strong password to secure your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <Form {...form}>
                        <form className='space-y-5' onSubmit={handleSubmit(onSubmitAsync)}>
                            <FormField
                                control={control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <User />
                                            </InputGroupAddon>
                                            <FormControl>
                                                <InputGroupInput
                                                    readOnly
                                                    placeholder="John Doe"
                                                    className="bg-muted"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </InputGroup>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                            </InputGroupAddon>
                                            <FormControl>
                                                <InputGroupInput
                                                    readOnly
                                                    placeholder="john.doe@example.com"
                                                    className="bg-muted"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </InputGroup>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="border-t pt-4">
                                <FormField
                                    control={control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">New Password</FormLabel>
                                            <InputGroup>
                                                <FormControl>
                                                    <InputGroupInput
                                                        type="password"
                                                        placeholder="Enter your new password"
                                                        autoComplete="new-password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <InputGroupAddon>
                                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FormDescription className="text-xs">
                                                Must be at least 8 characters and include 3 of: uppercase, lowercase, number, special character
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Confirm New Password</FormLabel>
                                        <InputGroup>
                                            <FormControl>
                                                <InputGroupInput
                                                    type="password"
                                                    placeholder="Re-enter your new password"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <InputGroupAddon>
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FormDescription className="text-xs">
                                            Both passwords must match
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                size='lg'
                                className="w-full"
                                disabled={formState.isSubmitting}
                            >
                                <span>Reset Password</span>
                                {formState.isSubmitting && <Spinner />}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}