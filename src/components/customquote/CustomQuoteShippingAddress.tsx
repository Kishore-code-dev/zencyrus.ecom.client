import { useCustomJob } from "@/hooks/use-custom-job"
import { cn } from "@/lib/utils"
import { useForm, useWatch } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Combobox } from "../ui/combobox"
import { useEffect, useState, useTransition } from "react"
import { Button } from "../ui/button"
import { MapPinPlus, Save } from "lucide-react"
import { Separator } from "../ui/separator"
import CustomQuoteTransportSelector from "./CustomQuoteTransportSelector"
import z from "zod"
import { optionItemSchema } from "@/config/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/config/api"
import { AxiosError } from "axios"
import { useApiAction } from "@/hooks/use-api-action"
import { Input } from "../ui/input"
import AddressPicker from "../address-picker/address-picker"
import { Spinner } from "../ui/spinner"
import { Card } from "../ui/card"


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


export default function CustomQuoteShippingAddress()
{
    const { customJobCheckoutForm } = useCustomJob()
    const [mode, setMode] = useState<"NEW" | "EXISTING">("EXISTING")
    const [loading, startTransition] = useTransition()
    const { apiActionAsync } = useApiAction()
    const addressId = useWatch({
        control: customJobCheckoutForm.control,
        name: "addressId"
    })

    const transportModeId = useWatch({
        control: customJobCheckoutForm.control,
        name: "transportModeId"
    })

    const paymentModeId = useWatch({
        control: customJobCheckoutForm.control,
        name: "paymentModeId"
    })

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
        disabled: mode == "EXISTING" || loading,
        resolver: zodResolver(formSchema)
    })

    const handleOnSubmit = async (payload: FormSchemaType) =>
    {
        try
        {
            const response = await api.post(`customeraddresses/create`, payload)
            if (response.status == 200 && response.data)
            {
                setMode("EXISTING")
                form.reset(form.formState.defaultValues)
                customJobCheckoutForm.setValue("addressId", { label: payload.addressReferenceName, value: response.data.id })
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
                        const address = response.data.payload as FormSchemaType
                        form.reset({
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
            customJobCheckoutForm.reset({
                transportModeId,
                paymentModeId,
            })
            form.reset({
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
            })
        }
    }, [addressId?.value, mode])


    return (
        <Card className="p-6 w-full">
            <CustomQuoteTransportSelector />
            <div className={cn("my-4 grid grid-cols-1 gap-5")}>
                <div className="flex gap-3 items-center w-full">
                    <div className="flex-1">
                        <FormField
                            control={customJobCheckoutForm.control}
                            name="addressId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select Address"
                                            path="customeraddresses/search?searchString"
                                            disabled={mode == "NEW"}
                                            mode="dynamic"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={() =>
                        {
                            setMode("NEW")
                            customJobCheckoutForm.setValue("addressId", { label: "", value: "" })
                        }}
                    >
                        <MapPinPlus />
                        Add address
                    </Button>
                </div>
                <Separator />
            </div>
            <Form {...form}>
                <form className="space-y-2.5" onSubmit={form.handleSubmit(handleOnSubmit)}>
                    <FormField
                        name="addressReferenceName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <div className="flex items-center">
                                    <FormLabel className="text-sm" htmlFor="postalCode">
                                        Address referenece name
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
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center">
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
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center">
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
                    <AddressPicker className="col-span-2" disabled={mode == "EXISTING"} />
                    <div className="ml-auto col-span-2 flex items-center gap-2.5">
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
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                <Save /> Save {form.formState.isSubmitting && <Spinner />}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </Card>
    )
}
