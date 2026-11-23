import type { ElementType } from "react"
import type { OptionItem } from "./common"

export interface PaymentOptionBadge
{
    text: string
    variant: "default" | "outline" | "secondary"
}

export interface PaymentOption extends OptionItem
{
    icon: ElementType,
    description: string
    badge: PaymentOptionBadge | null
    disabled: boolean
    amount: number
    additionalText: string
    balance: number
}