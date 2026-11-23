import { RadioGroup } from "../ui/radio-group";
import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { ShieldCheck, ChevronRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import CheckoutProduct from "./CheckoutProduct";
import PaymentOptionCard from "./PaymentOptionCard";
import { paymentOptions } from "@/config/payment-option";
import { cn } from "@/lib/utils";
import { useCheckout } from "@/hooks/use-chechout";
import { useShippingAddress } from "@/hooks/use-shipping-address";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Spinner } from "../ui/spinner";
import { useApiAction } from "@/hooks/use-api-action";
import { AxiosError } from "axios";
import { api } from "@/config/api";
import { useCart } from "@/hooks/use-cart";
import { useWatch } from "react-hook-form";
import type { CheckoutFormSchemaType } from "@/config/checkout";
import { purchase } from "@/analytics/ecommerce";

interface PaymentMethodProps extends ComponentProps<"div"> {}

export default function PaymentMethod({
    className,
    ...props
}: PaymentMethodProps) {
    const {
        checkoutInfo,
        fetchCheckoutInfoAsync,
        items,
        fetchCheckoutProductAsync,
    } = useCheckout();
    const { fetchData } = useCart();
    const { shippingForm, mode } = useShippingAddress();
    const { checkoutForm } = useCheckout();
    const { apiActionAsync } = useApiAction();
    const [open, setOpen] = useState<boolean>(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const canUseWallet =
        checkoutInfo.totalWalletAmount >=
        checkoutInfo.totalAmount + checkoutInfo.totalShippingAmount;
    const options = useMemo(
        () => paymentOptions(checkoutInfo, canUseWallet),
        [checkoutInfo, canUseWallet],
    );

    const { control, formState, handleSubmit } = checkoutForm;
    const paymentModeId = useWatch({ control, name: "paymentModeId" });
    const transportModeId = useWatch({ control, name: "transportModeId" });

    const getErrors = () => {
        if (mode === "NEW") return [];
        const e = formState.errors;
        return [
            paymentModeId ? "" : "Payment method is required",
            (e.addressId as any)?.message ??
                (e.addressId as any)?.value?.message,
            e.paymentModeId?.message,
            e.transportModeId?.message,
        ]
            .map((m) => (typeof m === "string" ? m.trim() : ""))
            .filter(Boolean);
    };

    const errors = getErrors();
    const handleOnSubmit = async (payload: CheckoutFormSchemaType) => {
        // Show alert dialog if there are validation errors
        if (errors.length > 0) {
            setErrorDialogOpen(true);
            return;
        } else {
            setErrorDialogOpen(false);
        }

        // if (payload.transportModeId == "f7ba2a38-0191-ab37-c57d-c65e0d95c45c" && !isAlreadyAlertShowed.current)
        // {
        //     setOpen(true);
        //     isAlreadyAlertShowed.current = true;
        //     return
        // }
        // else
        // {
        //     isAlreadyAlertShowed.current = false;
        // }

        try {
            const response = await api.post(`order/placeorder`, {
                addressId: payload.addressId.value,
                customerId: "",
                paymentModeId: payload.paymentModeId,
                transportModeId: payload.transportModeId,
                shippingProviderId: payload.shippingProviderId,
                orderItems: payload.orderItems,
            });

            if (
                payload.paymentModeId == "6e41261d-2f07-880f-e86e-867213454d82"
            ) {
                const { encryptedData, accessCode, paymentUrl } = response.data;
                const old = document.getElementById("__cca_form");
                if (old) old.remove();

                const form = document.createElement("form");
                form.id = "__cca_form";
                form.method = "POST";
                form.action = paymentUrl;
                form.style.display = "none";

                const enc = document.createElement("input");
                enc.type = "hidden";
                enc.name = "encRequest";
                enc.value = encryptedData;

                const code = document.createElement("input");
                code.type = "hidden";
                code.name = "access_code";
                code.value = accessCode;

                form.appendChild(enc);
                form.appendChild(code);
                document.body.appendChild(form);
                window.history.replaceState(null, "", "/");
                setTimeout(() => {
                    form.submit();
                }, 0);
            }

            if (
                payload.paymentModeId == "79e797dd-f2f7-a472-339c-cf9bdd1fc249"
            ) {
                await fetchData();
                await apiActionAsync(response);
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                await apiActionAsync(error.response);
            }
        } finally {
            purchase(items, checkoutInfo.totalAmount);
            setErrorDialogOpen(false);
        }
    };

    useEffect(() => {
        if (formState.submitCount > 0 && errors.length > 0) {
            setErrorDialogOpen(true);
        }
    }, [formState.submitCount]);

    useEffect(() => {
        fetchCheckoutInfoAsync();
        fetchCheckoutProductAsync();
    }, []);

    useEffect(() => {
        if (transportModeId == "f7ba2a38-0191-ab37-c57d-c65e0d95c45c") {
            setOpen(true);
            return;
        }
    }, [transportModeId]);

    return (
        <div
            className={cn("w-full flex items-center justify-center", className)}
            {...props}
        >
            {/* Error Alert Dialog */}
            <AlertDialog
                open={errorDialogOpen}
                onOpenChange={setErrorDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Complete your order details
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="flex flex-col gap-1.5 pt-1">
                                {errors.map((error, index) => (
                                    <p
                                        key={index}
                                        className="text-sm text-destructive font-medium"
                                    >
                                        {index + 1}. {error}
                                    </p>
                                ))}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setErrorDialogOpen(false)}
                        >
                            Got it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pick from Maruthi</AlertDialogTitle>
                        <AlertDialogDescription>
                            you have chose pick up from maruthi and you should
                            collect the product from Gokul Printers
                            Coimbatore
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setOpen(false)}>
                            Got it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="w-full border-border/60 gap-1.5">
                {/* Header */}
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <div>
                            <CardTitle className="text-lg leading-tight">
                                Payment Method
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                256-bit encrypted &amp; secure checkout
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <Separator />

                <Form {...shippingForm}>
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <CardContent className="p-0 gap-0">
                            <FormField
                                control={control}
                                name="paymentModeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                disabled={
                                                    checkoutInfo.totalItemToCheckout ==
                                                    0
                                                }
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="grid grid-cols-1 p-3"
                                            >
                                                {options.map((opt) => (
                                                    <PaymentOptionCard
                                                        key={opt.value}
                                                        option={opt}
                                                        isSelected={
                                                            field.value ===
                                                            opt.value
                                                        }
                                                        value={opt.value}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>

                        <Separator />

                        <CardFooter className="flex-col gap-4 pt-5">
                            <CheckoutProduct className="w-full" />
                            <div className="flex w-full items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Order Total
                                    </p>
                                    <p className="mt-0.5 font-mono text-2xl font-bold text-foreground">
                                        ₹
                                        {checkoutInfo.totalAmount +
                                            checkoutInfo.totalShippingAmount}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <BadgeCheck className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[11px] text-muted-foreground">
                                        Tax incl.
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={
                                    checkoutInfo.totalItemToCheckout == 0 ||
                                    formState.isSubmitting
                                }
                                size="lg"
                                className="w-full gap-2 rounded-xl font-semibold tracking-wide shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                Pay ₹
                                {checkoutInfo.totalAmount +
                                    checkoutInfo.totalShippingAmount}
                                {formState.isSubmitting ? (
                                    <Spinner />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
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
