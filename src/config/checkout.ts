import z from "zod";
import { optionItemSchema } from "./schema";

export const checkoutFormSchema = z.object({
    customerId: z.string().optional(),
    addressId: optionItemSchema.refine(item => !!item.value, "Address is required"),
    paymentModeId: z.string().nonempty("Payment mode is required"),
    transportModeId: z.string().nonempty("Transport mode is required"),
    shippingProviderId: z.string().optional(),
    orderItems: z.array(z.string())
})

export type CheckoutFormSchemaType = z.infer<typeof checkoutFormSchema>