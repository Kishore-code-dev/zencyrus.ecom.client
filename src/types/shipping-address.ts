import type { shippingAddressSchema } from "@/config/shipping-address"
import type { OptionItem } from "@/types/common"
import type { Dispatch, PropsWithChildren, SetStateAction } from "react"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"

export interface ShippingAddress
{
    addresstypeid: OptionItem
    addressreferencename: string
    contactpersonname: string
    addressline1: string
    addressline2: string
    mobileNo: string
    cityid: OptionItem
    districtid: OptionItem
    stateid: OptionItem
    countryid: OptionItem
    pincode: string

}

export type AddressMode = 'EXISTING' | 'NEW'

export type ShippingAddressSchemaType = z.infer<typeof shippingAddressSchema>

export interface ShippingAddressProvider extends PropsWithChildren
{

}


export interface ShippingAddressContextType
{
    mode: AddressMode
    setMode: Dispatch<SetStateAction<AddressMode>>
    // addressId: OptionItem
    shippingForm: UseFormReturn<ShippingAddressSchemaType>
}