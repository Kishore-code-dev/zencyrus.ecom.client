import { RadioGroup } from "../ui/radio-group";
import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { ShieldCheck, ChevronRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PaymentOptionCard from "./PaymentOptionCard";
import { paymentOptions } from "@/config/payment-option";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Spinner } from "../ui/spinner";
import { useApiAction } from "@/hooks/use-api-action";
import { AxiosError } from "axios";
import { api } from "@/config/api";
import { useCart } from "@/hooks/use-cart";
import { useCustomJob } from "@/hooks/use-custom-job";
import type { CustomJobCheckoutSchemaType } from "@/config/custom-job";
import type { CheckoutInfo } from "@/types/checkout";

interface PaymentMethodProps extends ComponentProps<'div'>
{

}

const buildFormData = (payload: CustomJobCheckoutSchemaType): FormData =>
{
    const form = new FormData();

    form.append("CustomJobId", String(payload.customJobId));
    form.append("AddressId", String(payload.addressId.value));
    form.append("PaymentModeId", String(payload.paymentModeId));
    form.append("TransportModeId", payload.transportModeId);
    payload.attachment.forEach((doc, i) =>
    {
        console.log(doc instanceof File, doc.name)
        form.append(`Attachments[${i}]`, doc)
    })

    return form;
};

export default function PaymentMethod({ className, ...props }: PaymentMethodProps)
{
    const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>({
        totalAmount: 0,
        totalItemToCheckout: 0,
        totalShippingAmount: 0,
        totalWalletAmount: 0
    });
    const { fetchData } = useCart()
    const { apiActionAsync } = useApiAction()
    const { customJobCheckoutForm, customJob } = useCustomJob()
    const canUseWallet = checkoutInfo.totalWalletAmount >= customJob.totalAmount;
    const options = useMemo(() => paymentOptions({ ...checkoutInfo, totalAmount: customJob.totalAmount }, canUseWallet), [checkoutInfo, canUseWallet, customJob]);

    const { handleSubmit, control, formState } = customJobCheckoutForm

    const errors = useMemo(() => [
        formState.errors.addressId?.message,
        formState.errors.paymentModeId?.message,
        formState.errors.transportModeId?.message,
        formState.errors.requiredDate?.message
    ].filter(Boolean), [formState.errors])

    const handleOnSubmit = async (payload: CustomJobCheckoutSchemaType) =>
    {
        try
        {
            const form = buildFormData(payload);
            const response = await api.post(`order/customjob/placeorder`, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            // CCAvenue
            if (payload.paymentModeId == "6e41261d-2f07-880f-e86e-867213454d82")
            {
                const { encryptedData, accessCode, paymentUrl } = response.data
                // Clean up any previous form
                const old = document.getElementById('__cca_form');
                if (old) old.remove();

                const form = document.createElement('form');
                form.id = '__cca_form';
                form.method = 'POST';
                form.action = paymentUrl;
                form.style.display = 'none';

                const enc = document.createElement('input');
                enc.type = 'hidden';
                enc.name = 'encRequest';
                enc.value = encryptedData;

                const code = document.createElement('input');
                code.type = 'hidden';
                code.name = 'access_code';
                code.value = accessCode;

                form.appendChild(enc);
                form.appendChild(code);
                document.body.appendChild(form);
                form.submit();

            }

            // Wallet
            if (payload.paymentModeId == "79e797dd-f2f7-a472-339c-cf9bdd1fc249")
            {
                await fetchData()
                await apiActionAsync(response);
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
            const resposne = await api.get(`checkout/info`)
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

    useEffect(() =>
    {
        fetchCheckoutInfoAsync()
    }, [])

    return (
        <div className={cn("w-full", className)} {...props}>
            <Card className="w-full border-border/60 gap-1.5">
                {/* Header */}
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div>
                            <CardTitle className="text-lg leading-tight">Payment Method</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                256-bit encrypted &amp; secure checkout
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <Separator />
                <Form {...customJobCheckoutForm}>
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <CardContent className="p-0 gap-0">
                            <FormField
                                control={control}
                                name="paymentModeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="grid grid-cols-1 p-3"
                                            >
                                                {options.map((opt) => (
                                                    <PaymentOptionCard
                                                        key={opt.value}
                                                        option={opt}
                                                        isSelected={field.value === opt.value}
                                                        value={opt.value}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>

                        <Separator />

                        {/* Summary + CTA */}
                        <CardFooter className="flex-col gap-4 pt-5">
                            <div className="flex w-full items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Order Total
                                    </p>
                                    <p className="mt-0.5 font-mono text-2xl font-bold text-foreground">
                                        ₹{customJob.totalAmount}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <BadgeCheck className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[11px] text-muted-foreground">Tax incl.</span>
                                </div>
                            </div>
                            {errors.length > 0 && (
                                <div className="h-fit w-full grid grid-cols-1 gap-1.5 place-content-start p-2">
                                    {errors.map((error, index) => (
                                        <p key={index} className="text-xs font-semibold text-destructive mr-auto">
                                            {index + 1}. {error}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {/* Pay button */}

                            <Button
                                type="submit"
                                disabled={formState.isSubmitting}
                                size="lg"
                                className="w-full gap-2 rounded-xl font-semibold tracking-wide shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                Pay ₹{customJob.totalAmount}
                                {formState.isSubmitting ? <Spinner /> : <ChevronRight className="h-4 w-4" />}
                            </Button>

                            <p className="text-center text-[11px] text-muted-foreground">
                                By continuing, you agree to our{" "}
                                <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                                    Terms &amp; Privacy Policy
                                </span>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}