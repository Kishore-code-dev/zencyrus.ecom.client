import type { OptionItem } from "./common";

export interface WalletInfo
{
    currentBalance: number
    totalAddedFund: number
    totalSpendFund: number
}

export interface WalletTransaction
{
    id: string
    referenceNo: string
    transactionType: OptionItem
    paymentMode: OptionItem
    transactionOn: string
    amount: number
}