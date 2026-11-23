import { shippingAddressSchema } from "@/config/shipping-address"
import { type AddressMode, type ShippingAddressContextType, type ShippingAddressProvider, type ShippingAddressSchemaType } from "@/types/shipping-address"
import { zodResolver } from "@hookform/resolvers/zod"
import { createContext, useState } from "react"
import { useForm } from "react-hook-form"



export const ShippingAddressContext = createContext<ShippingAddressContextType | null>(null)


export default function ShippingAddressProvider({ children }: ShippingAddressProvider)
{
    const [mode, setMode] = useState<AddressMode>("EXISTING")
    const shippingForm = useForm<ShippingAddressSchemaType>({
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            transportModeId: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c",
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
            },
            paymentModeId: "6e41261d-2f07-880f-e86e-867213454d82",
            shippingProviderId: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c"
        },
        resolver: zodResolver(shippingAddressSchema),
        mode: "onChange"
    })

    console.log(shippingForm.formState.errors)

    return (
        <ShippingAddressContext.Provider
            value={{
                mode,
                setMode,
                shippingForm
            }}
        >
            {children}
        </ShippingAddressContext.Provider>
    )
}
