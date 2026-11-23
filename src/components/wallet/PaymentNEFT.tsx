import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { OptionItem } from "@/types/common"

const PaymentNEFTDetails: OptionItem[] = [
    { label: "Account Name", value: "SHREE MARUTHI PRINTERS" },
    { label: "Account Number", value: "154805005088" },
    { label: "IFSC Code", value: "ICIC0001548" },
    { label: "Bank Name", value: "ICIC Bank" },
    { label: "Branch", value: "Siddhapudur Branch,Coimbatore" },
    { label: "Account Type", value: "Current Account" },
]

function CopyField({ item }: { item: OptionItem })
{
    const [copied, setCopied] = useState(false)

    const handleCopy = async () =>
    {
        try
        {
            await navigator.clipboard.writeText(item.value)
            setCopied(true)
            toast.success(`${item.label} copied to clipboard`)
            setTimeout(() => setCopied(false), 2000)
        } catch
        {
            toast.error("Failed to copy to clipboard")
        }
    }

    return (
        <div className="flex items-center justify-between py-3 group">
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {item.label}
                </span>
                <span className="text-sm font-semibold text-foreground font-mono truncate">
                    {item.value}
                </span>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="ml-4 h-8 w-8 shrink-0"
                aria-label={`Copy ${item.label}`}
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        </div>
    )
}

export default function PaymentNEFT()
{
    return (
        <Card className="h-fit w-full border border-border rounded-md grid grid-cols-1">
            <CardContent>
                <div className="divide-y divide-border">
                    {PaymentNEFTDetails.map((item, index) => (
                        <CopyField key={index} item={item} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}