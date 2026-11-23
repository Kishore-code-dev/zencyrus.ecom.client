import { RadioGroupItem } from "../ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import type { PaymentOption } from "@/types/payment-option";
import { FormLabel } from "../ui/form";

interface PaymentOptionCardProps extends ComponentProps<typeof RadioGroupItem>
{
    option: PaymentOption
    isSelected: boolean
}

export default function PaymentOptionCard({ option, isSelected }: PaymentOptionCardProps)
{
    const Icon = option.icon;

    return (
        <div className="relative">
            <RadioGroupItem
                value={option.value}
                id={option.value}
                className="peer sr-only"
                disabled={option.disabled}
            />
            <FormLabel
                htmlFor={option.value}
                className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200",
                    "cursor-pointer select-none",
                    "border-border bg-card hover:bg-accent/30 hover:border-accent/50",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                    option.disabled && "cursor-not-allowed opacity-45 hover:bg-card hover:border-border",
                )}
            >
                {/* Icon */}
                <div
                    className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                        isSelected
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "bg-muted text-muted-foreground"
                    )}
                >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className={cn(
                                "text-sm font-semibold leading-none",
                                isSelected ? "text-primary" : "text-foreground"
                            )}
                        >
                            {option.label}
                        </span>
                        {option.badge && (
                            <Badge
                                variant={option.badge.variant}
                                className={cn(
                                    "text-[10px] px-2 py-0 h-4 font-semibold tracking-wide",
                                    option.badge.variant === "default" &&
                                    "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                                )}
                            >
                                {option.badge.text}
                            </Badge>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                        {option.description}
                    </p>
                </div>

                {/* Amount + radio indicator */}
                <div className="flex items-center gap-3 shrink-0">
                    {option.amount !== undefined && (
                        <span
                            className={cn(
                                "font-mono text-sm font-bold rounded-lg px-2.5 py-1 transition-all",
                                isSelected
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            ₹{option.amount}
                        </span>
                    )}

                    {/* Custom radio circle */}
                    <div
                        className={cn(
                            "h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center shrink-0",
                            isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                        )}
                    >
                        {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                    </div>
                </div>
            </FormLabel>
        </div>
    );
}