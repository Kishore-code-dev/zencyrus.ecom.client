import type { OptionItem, PriceOptionItem } from "./common";
import type { PropsWithChildren } from "react";
import type { CustomJobCheckoutSchemaType } from "@/config/custom-job";
import type { UseFormReturn } from "react-hook-form";

export interface CustomJob
{
    id: string;
    title: string;
    referenceNo: string;
    instruction: string;
    quantity: number;
    materialSupplyId: OptionItem
    machineId: OptionItem
    gsmId: OptionItem
    mediaId: OptionItem
    paperSizeId: OptionItem
    printingSideId: OptionItem
    colorTypeFrontId: OptionItem
    colorTypeBackId: OptionItem
    isLaminationEnabled: boolean;
    laminationId: OptionItem
    laminationSideId: OptionItem
    laminationHeight: number;
    laminationWidth: number;
    laminationMeasurementUnit: string;
    laminationQuantity: number;
    requiredDate: string;
    totalAmount: number;
    otherSpecificationAmount: number;
    laminationAmount: number;
    customerId: OptionItem
    machiceId: OptionItem;
    enquiryDate: string;
    otherSpecifications: any[];
}

export interface CustomJobProviderProps extends PropsWithChildren
{

}

export interface CustomJobProviderContextValue
{
    customJob: CustomJob
    customJobCheckoutForm: UseFormReturn<CustomJobCheckoutSchemaType>
    loading: boolean

}
export type QuoteData = {
    runningQuantity: number
    materialQuantity: number
    totalRun: number
    materialSize: {
        height: number
        width: number
        label: string
        value: string
    }
    runningSize: {
        label: string
        value: string
    }
    paperCost: number
    printingCost: PriceOptionItem[]
    laminationCost: number
    otherSpecification: number
    totalAmount: number
    machineId: OptionItem
    customJobId: string
}