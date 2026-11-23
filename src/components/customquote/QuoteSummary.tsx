import
{
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { QuoteData } from "@/types/custom-job";
import { IndianRupee } from "lucide-react"


export default function QuoteSummary({ data }: { data: QuoteData })
{
    return (
        <div className="max-w-5xl mx-auto space-y-2">

            {/* HEADER */}
            <div className="flex justify-between items-start border-b pb-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Printing Estimate
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Detailed cost breakdown for your job
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Runs</p>
                    <p className="font-semibold">{data.totalRun}</p>
                </div>
            </div>

            {/* JOB DETAILS */}
            <Card className="rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Job Specifications
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Material Size</p>
                        <p className="font-medium text-xs">{data.materialSize.label}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Running Size</p>
                        <p className="font-medium text-xs">{data.runningSize.label}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Running Qty</p>
                        <p className="font-medium text-xs">{data.runningQuantity}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Material Qty</p>
                        <p className="font-medium text-xs">{data.materialQuantity}</p>
                    </div>
                </CardContent>
            </Card>

            {/* COST TABLE (INVOICE STYLE) */}
            <Card className="rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Cost Breakdown
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* TABLE HEADER */}
                    <div className="grid grid-cols-3 text-xs text-muted-foreground border-b pb-2">
                        <span>Description</span>
                        <span className="text-right">Type</span>
                        <span className="text-right">Amount</span>
                    </div>

                    {/* PAPER */}
                    <div className="grid grid-cols-3 text-sm">
                        <span>Paper Cost</span>
                        <span className="text-right text-muted-foreground">Material</span>
                        <span className="text-right flex justify-end items-center gap-1">
                            <IndianRupee size={14} /> {data.paperCost}
                        </span>
                    </div>

                    <Separator />

                    {/* PRINTING */}
                    {data.printingCost.map((item, i) =>
                    {
                        return (
                            <div key={i} className="space-y-2">
                                {/* sub-items */}
                                <div className="pl-4 space-y-1 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>{item.label}</span>
                                        <span>{item.price}</span>
                                    </div>
                                </div>

                                <Separator />
                            </div>
                        )
                    })}

                    {/* EXTRAS */}
                    <div className="grid grid-cols-3 text-sm">
                        <span>Lamination</span>
                        <span className="text-right text-muted-foreground">Add-on</span>
                        <span className="text-right">{data.laminationCost}</span>
                    </div>

                    <div className="grid grid-cols-3 text-sm">
                        <span>Other Specifications</span>
                        <span className="text-right text-muted-foreground">Add-on</span>
                        <span className="text-right">{data.otherSpecification}</span>
                    </div>

                </CardContent>
            </Card>

            {/* TOTAL SECTION */}
            <Card className="rounded-xl border shadow-sm">
                <CardContent className="space-y-4 p-6">
                    <div className="flex justify-between text-xl font-semibold">
                        <span>Total Estimate</span>
                        <span className="flex items-center gap-1">
                            <IndianRupee /> {data.totalAmount.toFixed(2)}
                        </span>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}