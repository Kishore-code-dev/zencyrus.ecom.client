import type { CheckoutInfo } from "@/types/checkout";
import type { PaymentOption } from "@/types/payment-option";
// import { CreditCard, Wallet, Zap, } from "lucide-react"
import { Wallet, Zap, } from "lucide-react"
// export const paymentOptions = (CheckoutInfo: CheckoutInfo, canUseCredit: boolean, canUseWallet: boolean): PaymentOption[] => [
//     {
//         value: "ccavenue",
//         icon: Zap,
//         label: "CC Avenue",
//         description: "UPI, Net banking, Debit & Credit cards",
//         badge: { text: "Recommended", variant: "default" },
//         amount: 0,
//         disabled: false,
//     },
//     {
//         value: "wallet",
//         icon: Wallet,
//         label: "Wallet",
//         description: canUseWallet ? "Pay directly from your wallet" : "Not enough to cover total",
//         amount: CheckoutInfo.totalWalletAmount,
//         badge: !canUseWallet ? { text: "Insufficient", variant: "secondary" } : null,
//         disabled: !canUseWallet,
//     },
//     // {
//     //     value: "credit",
//     //     icon: CreditCard,
//     //     label: "Store Credits",
//     //     description: canUseCredit ? "Apply your available credits" : "Not enough to cover total",
//     //     amount: CheckoutInfo.creditBalance,
//     //     badge: !canUseCredit ? { text: "Insufficient", variant: "secondary" } : null,
//     //     disabled: !canUseCredit,
//     // },
// ];
export const paymentOptions = (CheckoutInfo: CheckoutInfo, canUseWallet: boolean): PaymentOption[] => [
    {
        value: "6e41261d-2f07-880f-e86e-867213454d82",
        icon: Zap,
        label: "CC Avenue",
        description: "UPI, Net banking, Debit & Credit cards",
        badge: { text: "Recommended", variant: "default" },
        amount: (CheckoutInfo.totalAmount + CheckoutInfo.totalShippingAmount),
        disabled: false,
        additionalText: "",
        balance: 0
    },
    {
        value: "79e797dd-f2f7-a472-339c-cf9bdd1fc249",
        icon: Wallet,
        label: "Wallet",
        description: canUseWallet ? `Pay directly from your wallet` : "Not enough to cover total",
        amount: (CheckoutInfo.totalAmount + CheckoutInfo.totalShippingAmount),
        badge: !canUseWallet ? { text: "Insufficient", variant: "secondary" } : { text: "Recommended", variant: "default" },
        disabled: !canUseWallet,
        additionalText: `Available balance`,
        balance: CheckoutInfo.totalWalletAmount
    },
    // {
    //     value: "credit",
    //     icon: CreditCard,
    //     label: "Store Credits",
    //     description: canUseCredit ? "Apply your available credits" : "Not enough to cover total",
    //     amount: CheckoutInfo.creditBalance,
    //     badge: !canUseCredit ? { text: "Insufficient", variant: "secondary" } : null,
    //     disabled: !canUseCredit,
    // },
];
