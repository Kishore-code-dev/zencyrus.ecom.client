import z from "zod";

export const optionItemSchema = z.object({
    label: z.string(),
    value: z.string()
})


export const dimensionOptionItem = z.object({
    label: z.string(),
    value: z.string(),
    height: z.coerce.number<number>(),
    width: z.coerce.number<number>(),
})