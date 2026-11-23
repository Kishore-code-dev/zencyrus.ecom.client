import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { api } from "@/config/api"
import { useApiAction } from "@/hooks/use-api-action"
import { AxiosError } from "axios"
import AddressPicker from "../address-picker/address-picker"
import { useForm } from "react-hook-form"
import { optionItemSchema } from "@/config/schema"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useDataGrid } from "@/hooks/use-data-grid"
import { PhoneInput } from "../ui/phone-input"
import { isValidPhoneNumber } from "react-phone-number-input"


export const formSchema = z.object({
    addressTypeId: optionItemSchema.refine(item => !!item.value, { message: "Address type is required" }),
    addressReferenceName: z.string().nonempty("Address Reference is required"),
    contactPersonName: z.string().nonempty("Contact person is required"),
    addressLine1: z.string().nonempty("Address 1 is required"),
    addressLine2: z.string().optional(),
    mobileNo: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    cityId: optionItemSchema.refine(item => !!item.value, { message: "City is required" }),
    districtId: optionItemSchema.refine(item => !!item.value, { message: "District is required" }),
    stateId: optionItemSchema.refine(item => !!item.value, { message: "State is required" }),
    countryId: optionItemSchema.refine(item => !!item.value, { message: "Country is required" }),
    pincodeId: optionItemSchema.refine(item => !!item.value, { message: "Pincode is required" }),
})

type FormSchemaType = z.infer<typeof formSchema>


export default function UserAddressForm()
{
    const { apiActionAsync } = useApiAction()

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
        resolver: zodResolver(formSchema)
    })

    const { handleSubmitAsync, isRender, submissionUrl } = useDataGrid()

    const { control, handleSubmit, formState, reset } = form

    useEffect(() =>
    {
        if (isRender.action != "update") return;
        (async () =>
        {
            try
            {
                const response = await api.get(`${submissionUrl}/getbyid?id=${isRender.id}`)
                if (response.status == 200 && response.data)
                {
                    reset(response.data.payload)
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })()
    }, [isRender])

    return (
        <Form {...form}>
            <form className="grid md:grid-cols-2 grid-cols-1 gap-2.5" onSubmit={handleSubmit(handleSubmitAsync)}>
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
                                <Input id="postalCode" type="text" {...field} />
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
                                <Input id="postalCode" type="text" {...field} />
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
                                <PhoneInput id="postalCode" type="text" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <AddressPicker className="col-span-2 mt-2" />
                <Button type="submit" className="ml-auto col-span-2" disabled={formState.isSubmitting}>
                    <Save /> Save {formState.isSubmitting && <Spinner />}
                </Button>
            </form >
        </Form >
    )
}
