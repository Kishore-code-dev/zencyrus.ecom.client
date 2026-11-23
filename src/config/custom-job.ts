import type { CustomJob } from "@/types/custom-job";
import z from "zod";
import { optionItemSchema } from "./schema";

export const defaultCustomJob: CustomJob = {
    "id": "",
    "referenceNo": "",
    "paperSizeId": {
        "label": "",
        "value": ""
    },
    "instruction": "",
    "quantity": 100,
    "materialSupplyId": {
        "label": "",
        "value": ""
    },
    "enquiryDate": "2026-04-19T15:32:22",
    "gsmId": {
        "label": "",
        "value": ""
    },
    "mediaId": {
        "label": "",
        "value": ""
    },
    "printingSideId": {
        "label": "",
        "value": ""
    },
    "colorTypeFrontId": {
        "label": "1 color",
        "value": ""
    },
    "colorTypeBackId": {
        "label": "1 color",
        "value": ""
    },
    "laminationId": {
        "label": "",
        "value": ""
    },
    "laminationSideId": {
        label: "",
        value: ""
    },
    "laminationHeight": 0,
    "laminationWidth": 0,
    "laminationMeasurementUnit": "MM",
    "otherSpecifications": [],
    title: "",
    machineId: {
        label: "",
        value: ""
    },
    isLaminationEnabled: false,
    laminationQuantity: 0,
    requiredDate: "",
    totalAmount: 0,
    otherSpecificationAmount: 0,
    laminationAmount: 0,
    customerId: {
        label: "",
        value: ""
    },
    machiceId: {
        label: "",
        value: ""
    }
}

export const customJobCheckoutSchema = z.object({
    customJobId: z.string(),
    machineId: z.string().optional(),
    addressId: optionItemSchema.refine(data => !!data.label, { message: "Address is required" }),
    transportModeId: z.string().nonempty("Transport mode is required"),
    paymentModeId: z.string().nonempty("Payment mode is required"),
    attachment: z.array(z.custom<File>()).min(1, "Desigin file is required"),
    requiredDate: z.coerce.date<Date>().refine(
        (date) => date > new Date(),
        { message: "Date must be greater than today" }
    )
})

export type CustomJobCheckoutSchemaType = z.infer<typeof customJobCheckoutSchema>