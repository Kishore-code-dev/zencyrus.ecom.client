import z from "zod";
import { optionItemSchema } from "./schema";

export const shippingAddressSchema = z.object({
    addressTypeId: optionItemSchema.refine(item => !!item.value, { message: "Address type is required" }),
    transportModeId: z.string().nonempty("Transport mode is required"),
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
    paymentModeId: z.string().nonempty("Payment mode is required"),
    shippingProviderId: z.string().optional()
})