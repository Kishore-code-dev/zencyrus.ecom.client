import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCustomJob } from "@/hooks/use-custom-job";
import
{
    ClipboardList,
    Layers,
    Package,
    Palette,
    Printer,
    Ruler,
    Sparkles,
    Cpu
} from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DatePicker } from "../ui/date-picker";

interface FieldProps
{
    label: string;
    value: string;
    mono?: boolean;
    badge?: boolean;
    variant?: "default" | "secondary" | "outline";
}

function Field({ label, value, mono = false, badge = false, variant = "secondary" }: FieldProps)
{
    return (
        <div className="flex flex-col gap-1 min-w-27.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
            </span>
            {badge ? (
                <Badge variant={variant} className="w-fit text-xs font-semibold px-2.5 py-0.5">
                    {value}
                </Badge>
            ) : (
                <span
                    className={`text-sm font-medium ${mono ? "font-mono tracking-wide" : ""} ${!value ? "text-muted-foreground" : "text-foreground"
                        }`}
                >
                    {value || "—"}
                </span>
            )}
        </div>
    );
}

interface DimBoxProps
{
    label: string;
    value: number;
    unit: string;
}

function DimBox({ label, value, unit }: DimBoxProps)
{
    return (
        <div className="flex flex-col items-center gap-1 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{label}</span>
            <span className="text-2xl font-bold font-mono text-primary leading-none">{value}</span>
            <span className="text-[10px] font-semibold text-primary/70 uppercase">{unit}</span>
        </div>
    );
}



// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomJobDetails()
{
    const { customJob, customJobCheckoutForm } = useCustomJob()

    return (
        <div className="col-span-3">
            <div className="mx-auto space-y-5">

                {/* ── Page Header ── */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <Badge className="text-xs font-bold tracking-widest px-3 py-1 rounded-md">
                                CUSTOM JOB
                            </Badge>
                            <span className="font-mono text-xl font-bold tracking-wider text-foreground">
                                {customJob.referenceNo}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Row 1: Detail Cards ── */}
                <div className="grid grid-cols-1 gap-4">

                    {/* Card 1 — Job Details */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center gap-2 space-y-0 bg-muted/30 border-b border-border/50 rounded-t-xl">
                            <ClipboardList className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-semibold">Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 py-4 flex flex-col gap-4">
                            <Field label="Reference No" value={customJob.referenceNo} badge variant="default" />
                            <Separator />
                            <Field label="Quantity" value={`${customJob.quantity} pcs`} badge variant="secondary" />
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    <FormField
                                        control={customJobCheckoutForm.control}
                                        name="requiredDate"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                                    Required Date <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        className="w-full"
                                                        ref={field.ref}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        onBlur={field.onBlur}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-destructive" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    Supplier
                                </span>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    <Printer className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    {customJob.materialSupplyId.label || "—"}
                                </div>
                            </div>
                            <Separator />
                            {/* Machine — present in JSON but was missing from UI */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    Machine
                                </span>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    <Cpu className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    {customJob.machineId?.label || "—"}
                                </div>
                            </div>
                            <Separator />
                            <Field label="Instructions" value={customJob.instruction || "No instructions provided"} />
                        </CardContent>
                    </Card>

                    {/* Card 2 — Material Specs */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center gap-2 space-y-0 bg-muted/30 border-b border-border/50 rounded-t-xl">
                            <Package className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-semibold">Material Specs</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 py-4 flex flex-col gap-4">
                            <Field label="Paper Size" value={customJob.paperSizeId.label} badge variant="default" />
                            <Separator />
                            <Field label="GSM" value={customJob.gsmId.label} badge variant="secondary" />
                            <Separator />
                            <Field label="Media" value={customJob.mediaId.label} />
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    Printing Side
                                </span>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    {customJob.printingSideId.label}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3 — Color & Finish */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center gap-2 space-y-0 bg-muted/30 border-b border-border/50 rounded-t-xl">
                            <Palette className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-semibold">Color & Finish</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 py-4 flex flex-col gap-4">
                            <Field label="Color (Front)" value={customJob.colorTypeFrontId.label} badge variant="secondary" />
                            <Separator />
                            <Field label="Color (Back)" value={customJob.colorTypeBackId.label} badge variant="secondary" />
                            <Separator />
                            {/* Only render lamination fields when lamination is enabled */}
                            {customJob.isLaminationEnabled ? (
                                <>
                                    <Field label="Lamination" value={customJob.laminationId.label} badge variant="default" />
                                    <Separator />
                                    {/* laminationSideId is an object {label, value} — use .label */}
                                    <Field
                                        label="Lamination Side"
                                        value={customJob.laminationSideId?.label || "Not specified"}
                                    />
                                    <Separator />
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                            Lamination
                                        </span>
                                        <Badge variant="outline" className="w-fit text-xs font-semibold px-2.5 py-0.5 text-muted-foreground">
                                            Not Applicable
                                        </Badge>
                                    </div>
                                    <Separator />
                                </>
                            )}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Other Specifications
                                </span>
                                {customJob.otherSpecifications.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {customJob.otherSpecifications.map((spec) => (
                                            <Badge
                                                key={spec.value}
                                                variant="outline"
                                                className="text-[11px] font-semibold tracking-wide text-violet-700 border-violet-300 bg-violet-50"
                                            >
                                                {spec.label}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 4 — Lamination Size (only shown when lamination is enabled) */}
                    {customJob.isLaminationEnabled && (
                        <Card className="shadow-sm border-border/60">
                            <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center gap-2 space-y-0 bg-muted/30 border-b border-border/50 rounded-t-xl">
                                <Ruler className="w-4 h-4 text-primary" />
                                <CardTitle className="text-sm font-semibold">Lamination Size</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 py-4 flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-4 py-2">
                                    {/* Fixed: was laminationUnit, correct field is laminationMeasurementUnit */}
                                    <DimBox label="Width" value={customJob.laminationWidth} unit={customJob.laminationMeasurementUnit} />
                                    <span className="text-2xl font-light text-muted-foreground">×</span>
                                    <DimBox label="Height" value={customJob.laminationHeight} unit={customJob.laminationMeasurementUnit} />
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1 items-center text-center">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                        Total Area
                                    </span>
                                    <span className="text-base font-bold font-mono text-foreground">
                                        {customJob.laminationWidth * customJob.laminationHeight}{" "}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {customJob.laminationMeasurementUnit}²
                                        </span>
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}