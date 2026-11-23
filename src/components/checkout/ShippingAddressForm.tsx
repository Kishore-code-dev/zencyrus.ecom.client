import { useShippingAddress } from "@/hooks/use-shipping-address"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Save, TruckElectric } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { api } from "@/config/api"
import { useApiAction } from "@/hooks/use-api-action"
import { AxiosError } from "axios"
import AddressPicker from "../address-picker/address-picker"
import TransportModeSelector from "./TransportModeSelector"
import ShippingAddressSelector from "./ShippingAddressSelector"
import { useForm, useWatch } from "react-hook-form"
import { optionItemSchema } from "@/config/schema"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useTransition } from "react"
import type { ShippingAddressSchemaType } from "@/types/shipping-address"
import { useCheckout } from "@/hooks/use-chechout"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

export const formSchema = z.object({
    addressTypeId: optionItemSchema.refine(item => !!item.value, { message: "Address type is required" }),
    addressReferenceName: z.string().nonempty("Address Reference is required"),
    contactPersonName: z.string().nonempty("Contact person is required"),
    addressLine1: z.string().nonempty("Address 1 is required"),
    addressLine2: z.string().optional(),
    mobileNo: z.string().nonempty("Mobile no is required"),
    cityId: optionItemSchema.refine(item => !!item.value, { message: "City is required" }),
    districtId: optionItemSchema.refine(item => !!item.value, { message: "District is required" }),
    stateId: optionItemSchema.refine(item => !!item.value, { message: "State is required" }),
    countryId: optionItemSchema.refine(item => !!item.value, { message: "Country is required" }),
    pincodeId: optionItemSchema.refine(item => !!item.value, { message: "Pincode is required" }),
})

type FormSchemaType = z.infer<typeof formSchema>

export default function ShippingAddressForm()
{
    const { apiActionAsync } = useApiAction()
    const { shippingForm, mode, setMode } = useShippingAddress()
    const [loading, startTransition] = useTransition()
    const { fetchShippingCostInfoAsync, fetchCourierChargesAsync, fetchCheckoutInfoAsync, courier, checkoutForm } = useCheckout()

    const addressId = useWatch({
        control: checkoutForm.control,
        name: "addressId"
    })

    const transportModeId = useWatch({
        control: checkoutForm.control,
        name: "transportModeId"
    })

    const paymentModeId = useWatch({
        control: checkoutForm.control,
        name: "paymentModeId"
    })

    const shippingProviderId = useWatch({
        control: checkoutForm.control,
        name: "shippingProviderId"
    })

    const orderItems = useWatch({
        control: checkoutForm.control,
        name: "orderItems"
    })

    const isShownCourierList = useMemo(() => transportModeId === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" && addressId && addressId.value, [transportModeId, addressId])

    const form = useForm<FormSchemaType>({
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            addressReferenceName: "",
            addressTypeId: {
                label: "",
                value: "426dd7ed-4cf8-4d63-da5e-a641e9cca771"
            },
            cityId: {
                label: "",
                value: ""
            },
            contactPersonName: "",
            countryId: {
                label: "",
                value: ""
            },
            districtId: {
                label: "",
                value: ""
            },
            mobileNo: "",
            pincodeId: {
                label: "",
                value: ""
            },
            stateId: {
                label: "",
                value: ""
            }
        },
        mode: "onChange",
        disabled: mode == "EXISTING",
        resolver: zodResolver(formSchema)
    })

    const { control, formState, handleSubmit, reset } = shippingForm
    const handleOnSubmit = async (payload: FormSchemaType) =>
    {
        try
        {
            const response = await api.post(`customeraddresses/create`, payload)
            if (response.status == 200 && response.data)
            {
                setMode("EXISTING")
                form.reset(form.formState.defaultValues)
                checkoutForm.setValue("addressId", { label: payload.addressReferenceName, value: response.data.id })
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
        if (addressId && addressId.value && mode == "EXISTING")
        {
            startTransition(async () =>
            {
                try
                {
                    const response = await api.get(`customeraddresses/getbyid?id=${addressId.value}`)
                    if (response.status == 200 && response.data)
                    {
                        const address = response.data.payload as ShippingAddressSchemaType
                        reset({
                            addressLine1: address.addressLine1,
                            addressLine2: address.addressLine2,
                            addressReferenceName: address.addressReferenceName,
                            addressTypeId: address.addressTypeId,
                            cityId: address.cityId,
                            contactPersonName: address.contactPersonName,
                            countryId: address.countryId,
                            districtId: address.districtId,
                            mobileNo: address.mobileNo,
                            pincodeId: address.pincodeId,
                            stateId: address.stateId,
                        })
                        checkoutForm.reset({
                            addressId,
                            paymentModeId,
                            transportModeId,
                            shippingProviderId,
                            orderItems
                        })
                    }
                } catch (error)
                {
                    if (error instanceof AxiosError && error.response)
                    {
                        await apiActionAsync(error.response)
                    }
                }
            })
        }
        if (mode == "NEW")
        {
            checkoutForm.reset({
                addressId: {
                    label: "",
                    value: ""
                },
                customerId: "",
                paymentModeId,
                shippingProviderId,
                transportModeId,
                orderItems
            })
            reset({
                addressLine1: "",
                addressLine2: "",
                addressReferenceName: "",
                addressTypeId: {
                    label: "",
                    value: "426dd7ed-4cf8-4d63-da5e-a641e9cca771"
                },
                cityId: {
                    label: "",
                    value: ""
                },
                contactPersonName: "",
                countryId: {
                    label: "",
                    value: ""
                },
                districtId: {
                    label: "",
                    value: ""
                },
                mobileNo: "",
                paymentModeId,
                pincodeId: {
                    label: "",
                    value: ""
                },
                shippingProviderId,
                stateId: {
                    label: "",
                    value: ""
                },
                transportModeId
            })
        }
    }, [addressId?.value, mode])


    useEffect(() =>
    {

        if (transportModeId == "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" && addressId && addressId.value)
        {
            if (shippingProviderId)
            {
                startTransition(async () =>
                {
                    await fetchCourierChargesAsync(addressId.value)
                    await fetchShippingCostInfoAsync(addressId.value, shippingProviderId)
                })
            }
            else
            {
                startTransition(async () =>
                {
                    await fetchCourierChargesAsync(addressId.value)
                })
            }
        }
        else
        {
            startTransition(async () =>
            {
                await fetchCheckoutInfoAsync()
            })
        }
    }, [shippingProviderId, transportModeId, addressId])


    return (
        <Form {...shippingForm}>
            <form className="grid md:grid-cols-2 grid-cols-1 gap-2.5" onSubmit={handleSubmit(handleOnSubmit)}>
                <TransportModeSelector />
                <h2 className="font-display text-xl font-semibold md:col-span-2">Shipping Address</h2>
                <ShippingAddressSelector className="md:col-span-2 my-1" />
                <div className={cn("grid gap-3.5", isShownCourierList ? "md:grid-cols-3 md:col-span-2" : "col-span-2")}>
                    <div className="md:col-span-2">
                        <FormField
                            name="addressReferenceName"
                            control={control}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <div className="flex items-center">
                                        <FormLabel className="text-sm" htmlFor="postalCode">
                                            Company Name
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input id="postalCode" type="text" {...field} disabled={mode == "EXISTING"} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="contactPersonName"
                            control={control}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center  mt-2">
                                        <FormLabel className="text-sm" htmlFor="postalCode">
                                            Contact person
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input id="postalCode" type="text" {...field} disabled={mode == "EXISTING"} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="mobileNo"
                            control={control}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center mt-2">
                                        <FormLabel className="text-sm" htmlFor="postalCode">
                                            Mobile no
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input id="postalCode" type="text" {...field} disabled={mode == "EXISTING"} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <AddressPicker className="col-span-2 mt-2" disabled={mode == "EXISTING"} />
                        <div className="col-span-2 flex items-center justify-end gap-2.5 my-2.5 ml-auto">
                            {mode == "NEW" && (
                                <Button variant='outline' onClick={() =>
                                {
                                    form.reset();
                                    setMode("EXISTING")
                                }}>
                                    Cancel
                                </Button>
                            )}
                            {mode == "NEW" && (
                                <Button type="submit" disabled={formState.isSubmitting}>
                                    <Save /> Save {formState.isSubmitting && <Spinner />}
                                </Button>
                            )}
                        </div>
                    </div>
                    {transportModeId === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" && addressId && addressId.value && (
                        <FormField
                            control={checkoutForm.control}
                            name="shippingProviderId"
                            render={({ field }) => (
                                <FormItem className="h-fit">
                                    <FormLabel className="font-display text-xl font-semibold">Courier <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <div className="h-fit w-full grid grid-cols-1 gap-2.5">
                                            {courier.map(option =>
                                            {
                                                const isSelected = field.value == option.value;

                                                return (
                                                    <div key={option.value} className="relative" onClick={() => loading || transportModeId !== "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" ? null : field.onChange(option.value)}>
                                                        <FormLabel
                                                            className={cn(
                                                                "flex items-center gap-4 rounded-lg border-2 p-4 transition-all duration-200",
                                                                "cursor-pointer select-none",
                                                                "border-border bg-card hover:bg-accent/30 hover:border-accent/50",
                                                                isSelected && "border-primary bg-primary/5",
                                                                transportModeId !== "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" && "cursor-not-allowed"
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                                                                    isSelected
                                                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                                                                        : "bg-muted text-muted-foreground"
                                                                )}
                                                            >
                                                                <TruckElectric className="h-5 w-5" strokeWidth={1.8} />
                                                            </div>
                                                            {/* Text */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span
                                                                        className={cn(
                                                                            "text-xs font-semibold leading-none",
                                                                            isSelected ? "text-primary" : "text-foreground"
                                                                        )}
                                                                    >
                                                                        {option.label}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Amount + radio indicator */}
                                                            <Badge className="rounded-md"> ₹ {option.price}</Badge>
                                                        </FormLabel>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </FormControl>
                                </FormItem >
                            )}
                        />
                    )}
                </div>
            </form>
        </Form >
    )
}
