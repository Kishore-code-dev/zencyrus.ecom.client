import type { MachinePriceOptionItem } from "./common"

export interface EstimateResponse
{
    open: boolean
    materialAmount: number
    printingAmount: MachinePriceOptionItem[]
    otherSpecificationAmount: number
    totalAmount: number
}