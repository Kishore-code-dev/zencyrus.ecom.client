import z from "zod"
import { optionItemSchema } from "./schema"

export const catalogformSchema = z.object({
    searchString: z.string(),
    producttypeid: optionItemSchema.optional(),
    classificationid: optionItemSchema.optional(),
    categoryid: optionItemSchema.optional(),
    mediaid: optionItemSchema.optional(),
    gsmid: optionItemSchema.optional(),
    printingsideid: optionItemSchema.optional(),
    quantityid: optionItemSchema.optional(),
    // price: z.object({
    //   min: z.coerce.number<number>(),
    //   max: z.coerce.number<number>()
    // })
})

export type CatalogFormSchemaType = z.infer<typeof catalogformSchema>
