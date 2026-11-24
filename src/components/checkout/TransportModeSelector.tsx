import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, Bus, TruckElectric } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCheckout } from "@/hooks/use-chechout"

const options = [
    {
        label: "Pick from Gokul Printers",
        value: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c",
        icon: Building2
    },
    {
        label: "Courier",
        value: "f4d52b0d-a4fa-4dbb-b855-c215ac55e509",
        icon: TruckElectric
    },
    {
        label: "Transportation",
        value: "426dd7ed-4cf8-4d63-da5e-a641e9cca771",
        icon: Bus
    }
]

export default function TransportModeSelector()
{
    const { checkoutForm } = useCheckout()
    const { control } = checkoutForm

    return (
        <>
            <FormField
                control={control}
                name="transportModeId"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel className="font-display text-xl font-semibold">Transport mode <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                            <RadioGroup className="h-fit w-full grid grid-cols-3 gap-2.5" value={field.value}
                                onValueChange={(val) =>
                                {
                                    field.onChange(val)
                                    if (val == "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")
                                    {
                                        checkoutForm.setValue("shippingProviderId", "f7ba2a38-0191-ab37-c57d-c65e0d95c45c")
                                    }
                                    else
                                    {
                                        checkoutForm.setValue("shippingProviderId", "")
                                    }
                                }}>
                                {options.map(option =>
                                {
                                    const isSelected = field.value == option.value;

                                    return (
                                        <div className="relative">
                                            <RadioGroupItem
                                                value={option.value}
                                                id={option.value}
                                                className="peer sr-only"
                                            />
                                            <FormLabel
                                                htmlFor={option.value}
                                                className={cn(
                                                    "flex items-center gap-4 rounded-lg border-2 p-4 transition-all duration-200",
                                                    "cursor-pointer select-none",
                                                    "border-border bg-card hover:bg-accent/30 hover:border-accent/50",
                                                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                                                    // option.disabled && "cursor-not-allowed opacity-45 hover:bg-card hover:border-border",
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
                                                    <option.icon className="h-5 w-5" strokeWidth={1.8} />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span
                                                            className={cn(
                                                                "text-xs font-semibold leading-none",
                                                                isSelected ? "text-primary" : "text-foreground"
                                                            )}
                                                        >
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Amount + radio indicator */}
                                                <div className="flex items-center gap-3 shrink-0">
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
                                    )
                                })}
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )}
            />
        </>
    )
}
