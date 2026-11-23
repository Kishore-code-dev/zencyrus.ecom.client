import { api } from "@/config/api";
import { useApiAction } from "@/hooks/use-api-action";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Link, useParams } from "react-router";
import {
    Package,
    MapPin,
    Phone,
    CalendarDays,
    Hash,
    // Layers3,
    Truck,
    ReceiptText,
    ArrowLeft,
    User,
    XCircle,
    ChevronRight,
    Ban,
    Eye,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderCancelationBtn from "@/components/orderHistory/OrderCancelationBtn";
import type { OptionItem } from "@/types/common";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface OrderDetails {
    id: string;
    shippingMethod: string;
    orderDate: Date;
    approvedBy: OptionItem;
    orderReferenceNumber: string;
    totalAmount: number;
    isCustomJob: boolean;
    totalItems: number;
    totalShippingAmount: number;
    customJobReferenceNo: string;
    items: Item[];
    canceledItems: Item[];
    shippingAddress: Address;
    billingAddress: Address;
    paymentMode: string;
    isPaymentSucceeded: boolean;
    remarks: string;
}

export interface Address {
    contactPersonName: string;
    addressLine1: string;
    addressLine2: string;
    mobileNo: string;
    country: string;
    state: string;
    district: string;
    pinCode: string;
    area: string;
}

export interface Item {
    id: string;
    referecnceNo: string;
    productName: string;
    subProductName: string;
    cellCount: number;
    totalamount: number;
    grandTotal: number;
    subtotalamount: number;
    shippingamount: number;
    additionprocessingamount: number;
    isBatched: boolean;
    designFileUrl: string[];
    batchName: string;
    batchItemStatus: string;
    isCanceled: boolean;
    courierName: string;
    trackingUrl: string;
    trackingNumber: string;
    additionProcessing: string[];
    instruction: string;
    noOfUnits: number;
    customQuantity: number;
    quantity: number;
}

export interface OrderTransportChanges {
    id: string;
    orderId: OptionItem;
    orderItemId: OptionItem;
    addressId: OptionItem;
    remarks: string;
    oldTransportModeId: OptionItem;
    oldShippingProviderId: OptionItem;
    newTransportModeId: OptionItem;
    newShippingProviderId: OptionItem;
    oldCost: number;
    newCost: number;
    proofUrl: string;
    changedBy: OptionItem;
    changedOn: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(n);

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */

function OrderDetailsSkeleton() {
    return (
        <div className="w-full p-6 space-y-5 max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-72" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
            </div>
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
        </div>
    );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────────── */

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    subLabel = "",
    accent = false,
    className = "",
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    sub?: string;
    subLabel?: string;
    accent?: boolean;
    className?: string;
}) {
    return (
        <div
            className={cn(
                `relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
                    accent
                        ? "bg-primary border-primary/80 text-primary-foreground"
                        : "bg-card border-border"
                }`,
                className,
            )}
        >
            <div className="flex items-start justify-between mb-">
                <p
                    className={`text-[10px] font-bold uppercase tracking-[0.15em] ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                    {label}
                </p>
                <div
                    className={`p-1.5 rounded-lg ${accent ? "bg-white/20" : "bg-muted"}`}
                >
                    <Icon
                        className={`h-3.5 w-3.5 ${accent ? "text-primary-foreground" : "text-muted-foreground"}`}
                    />
                </div>
            </div>
            <p className={`text-[15px] font-bold uppercase tracking-[0.15em]`}>
                {subLabel}
            </p>
            <p
                className={`text-2xl font-bold tracking-tight  ${accent ? "text-primary-foreground" : "text-foreground"}`}
            >
                {value}
            </p>
            {sub && (
                <p
                    className={`text-xs mt-1 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                    {sub}
                </p>
            )}
        </div>
    );
}

/* ─── Section Header ─────────────────────────────────────────────────────────── */

function SectionHeader({
    icon: Icon,
    title,
    right,
    variant = "default",
}: {
    icon: React.ElementType;
    title: string;
    right?: React.ReactNode;
    variant?: "default" | "destructive";
}) {
    const isDestructive = variant === "destructive";
    return (
        <div
            className={`flex items-center justify-between px-5 py-4 border-b ${isDestructive ? "border-destructive/20 bg-destructive/5" : "border-border"}`}
        >
            <div className="flex items-center gap-2.5">
                <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center border ${
                        isDestructive
                            ? "bg-destructive/10 border-destructive/20"
                            : "bg-primary/10 border-primary/20"
                    }`}
                >
                    <Icon
                        className={`h-3.5 w-3.5 ${isDestructive ? "text-destructive" : "text-primary"}`}
                    />
                </div>
                <h2
                    className={`text-sm font-semibold tracking-tight ${isDestructive ? "text-destructive" : "text-foreground"}`}
                >
                    {title}
                </h2>
            </div>
            {right}
        </div>
    );
}

/* ─── Shared Table Columns ───────────────────────────────────────────────────── */

function ItemsTableHead() {
    return (
        <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground pl-5 w-20">
                    Design
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground w-32">
                    Ref No.
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Product
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    CC
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    QTY
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Product Amt
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Instructions
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Additional Processing
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    QTY Ordered
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Shipping
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Courier
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Tracking No
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Processing
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground text-left">
                    Total
                </TableHead>
                {/* <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Batch
                </TableHead> */}
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground pr-5">
                    Status
                </TableHead>
            </TableRow>
        </TableHeader>
    );
}

/* ─── Active Item Row ────────────────────────────────────────────────────────── */

function ActiveItemRow({
    lineItem,
    fetchOrderDetailsAsync,
    isPaymentSucceeded = true,
    isCustomJob = false,
}: {
    lineItem: Item;
    fetchOrderDetailsAsync: () => Promise<void>;
    isPaymentSucceeded: boolean;
    isCustomJob: boolean;
}) {
    return (
        <TableRow className="border-b border-border/50 hover:bg-muted/20 transition-colors">
            <TableCell>
                {lineItem.designFileUrl.map((url, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-md border h-fit w-32"
                    >
                        <img
                            loading="lazy"
                            decoding="async"
                            src={url}
                            alt="Preview"
                            className="object-contain w-full h-full"
                        />

                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full"
                                        title="View"
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <img
                                        loading="lazy"
                                        decoding="async"
                                        src={url}
                                        alt="Full preview"
                                        className="object-contain w-full max-h-[75vh]"
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
            </TableCell>
            <TableCell>
                <Badge>{lineItem.referecnceNo}</Badge>
            </TableCell>
            <TableCell className="whitespace-normal py-4">
                <p className="text-sm font-semibold leading-tight text-foreground">
                    {lineItem.productName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {lineItem.subProductName}
                </p>
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.cellCount}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.quantity}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {fmt(lineItem.totalamount)}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.instruction}
            </TableCell>
            <TableCell className="whitespace-normal text-left text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2.5">
                    {lineItem.additionProcessing.map((item, idx) => (
                        <Badge key={idx}>{item}</Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {isCustomJob ? lineItem.customQuantity : lineItem.noOfUnits}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.shippingamount > 0 ? (
                    fmt(lineItem.shippingamount)
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.courierName ? (
                    lineItem.courierName
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.trackingNumber && lineItem.trackingUrl ? (
                    <Button
                        size="sm"
                        variant="link"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                lineItem.trackingNumber!,
                            );
                            window.open(lineItem.trackingUrl, "_blank");
                        }}
                    >
                        {lineItem.trackingNumber}
                    </Button>
                ) : lineItem.trackingNumber ? (
                    <span>{lineItem.trackingNumber}</span>
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.additionprocessingamount > 0 ? (
                    fmt(lineItem.additionprocessingamount)
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left">
                <span className=" text-sm font-bold text-foreground">
                    {fmt(lineItem.grandTotal)}
                </span>
            </TableCell>
            {/* <TableCell>
                {lineItem.batchName ? (
                    <span className="inline-flex items-center text-[10px]  font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wide">
                        {lineItem.batchName}
                    </span>
                ) : (
                    <span className="text-border text-xs">—</span>
                )}
            </TableCell> */}
            <TableCell className="whitespace-normal pr-5">
                {lineItem.isBatched ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wide">
                        {lineItem.batchItemStatus == "Waiting for Mockfile"
                            ? "Batched"
                            : lineItem.batchItemStatus}
                    </span>
                ) : isPaymentSucceeded ? (
                    <OrderCancelationBtn
                        orderItemId={lineItem.id}
                        fetchOrderDetailsAsync={fetchOrderDetailsAsync}
                    />
                ) : (
                    <Badge>Payment failed or canceled</Badge>
                )}
            </TableCell>
        </TableRow>
    );
}

/* ─── Cancelled Item Row ─────────────────────────────────────────────────────── */

function CancelledItemRow({
    lineItem,
    isCustomJob = false,
}: {
    lineItem: Item;
    isCustomJob: boolean;
}) {
    return (
        <TableRow className="border-b border-destructive/10 bg-destructive/2 hover:bg-destructive/4 transition-colors opacity-70">
            <TableCell className="whitespace-normal flex flex-wrap items-center justify-center gap-2.5">
                {lineItem.designFileUrl.map((url, index) => (
                    <img
                        loading="lazy"
                        decoding="async"
                        key={index}
                        src={url}
                        className="object-contain"
                    />
                ))}
            </TableCell>
            <TableCell>
                <Badge>{lineItem.referecnceNo}</Badge>
            </TableCell>
            <TableCell className="whitespace-normal py-4">
                <p className="text-sm font-semibold leading-tight text-foreground">
                    {lineItem.productName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {lineItem.subProductName}
                </p>
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.cellCount}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.quantity}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {fmt(lineItem.totalamount)}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.instruction}
            </TableCell>
            <TableCell className="whitespace-normal text-left text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2.5">
                    {lineItem.additionProcessing.map((item, idx) => (
                        <Badge key={idx}>{item}</Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {isCustomJob ? lineItem.customQuantity : lineItem.noOfUnits}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.shippingamount > 0 ? (
                    fmt(lineItem.shippingamount)
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.courierName ? (
                    lineItem.courierName
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.trackingNumber && lineItem.trackingUrl ? (
                    <Button
                        size="sm"
                        variant="link"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                lineItem.trackingNumber!,
                            );
                            window.open(lineItem.trackingUrl, "_blank");
                        }}
                    >
                        {lineItem.trackingNumber}
                    </Button>
                ) : lineItem.trackingNumber ? (
                    <span>{lineItem.trackingNumber}</span>
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left  text-sm text-muted-foreground">
                {lineItem.additionprocessingamount > 0 ? (
                    fmt(lineItem.additionprocessingamount)
                ) : (
                    <span className="text-border">—</span>
                )}
            </TableCell>
            <TableCell className="whitespace-normal text-left">
                <span className=" text-sm font-bold text-foreground">
                    {fmt(lineItem.grandTotal)}
                </span>
            </TableCell>
            {/* <TableCell>
                {lineItem.batchName ? (
                    <span className="inline-flex items-center text-[10px]  font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wide">
                        {lineItem.batchName}
                    </span>
                ) : (
                    <span className="text-border text-xs">—</span>
                )}
            </TableCell> */}
            <TableCell className="whitespace-normal pr-5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                    <XCircle className="h-2.5 w-2.5" />
                    Cancelled
                </span>
            </TableCell>
        </TableRow>
    );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

const formatIST = (value: any): string | null => {
    if (!value) return null;
    const ist = new Date(value + "Z").toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
    });
    return ist;
};

export default function OrderDetails() {
    const { orderId = "" } =
        useParams<Readonly<Partial<{ orderId: string }>>>();
    const { apiActionAsync } = useApiAction();
    const [item, setItem] = useState<OrderDetails | null>(null);
    const [loading, startTransition] = useTransition();

    const activeItems = item?.items ?? [];
    const canceledItems = item?.canceledItems ?? [];
    const grandTotal = useMemo(
        () =>
            (item?.totalAmount ?? 0) -
            (item?.canceledItems ?? []).reduce(
                (acc, curr) => acc + curr.grandTotal,
                0,
            ),
        [item?.canceledItems, item?.items],
    );

    // const fetchOrderTransportChangeAsync = async () =>
    // {
    //     try
    //     {
    //         const response = await api.get(`order/orderamendment?orderId=${orderId}`);
    //         if (response.status === 200 && response.data)
    //         {
    //             setOrderTransportChange(response.data);
    //         }
    //     } catch (error)
    //     {
    //         if (error instanceof AxiosError && error.response)
    //         {
    //             await apiActionAsync(error.response);
    //         }
    //     }
    // }

    const fetchOrderDetailsAsync = async () => {
        try {
            const response = await api.get(
                `order/getdetails?orderId=${orderId}`,
            );
            if (response.status === 200 && response.data) {
                setItem(response.data);
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                await apiActionAsync(error.response);
            }
        }
    };

    useEffect(() => {
        startTransition(async () => {
            await fetchOrderDetailsAsync();
            // await fetchOrderTransportChangeAsync();
        });
    }, [orderId]);

    if (loading) return <OrderDetailsSkeleton />;

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96 gap-3 text-center p-6">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold">Order not found</p>
                <p className="text-sm text-muted-foreground">
                    The order you're looking for doesn't exist or was removed.
                </p>
                <Link to="/orders">
                    <Button variant="outline" size="sm" className="mt-2">
                        <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                        Back to Orders
                    </Button>
                </Link>
            </div>
        );
    }

    const { shippingAddress, billingAddress } = item;

    const shippingAddressParts = [
        shippingAddress.addressLine1,
        shippingAddress.addressLine2,
        shippingAddress.area,
        shippingAddress.district,
        shippingAddress.state,
        shippingAddress.pinCode,
        shippingAddress.country,
    ].filter(Boolean);

    const billingAddressParts = [
        billingAddress.addressLine1,
        billingAddress.addressLine2,
        billingAddress.area,
        billingAddress.district,
        billingAddress.state,
        billingAddress.pinCode,
        billingAddress.country,
    ].filter(Boolean);

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="mx-auto px-6 py-6 space-y-5">
                {/* ── Back + Header ───────────────────────────────────────────── */}
                <div>
                    <Link to="/orders">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                            Back to order history
                        </Button>
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <span>Orders</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground font-medium ">
                            {item.orderReferenceNumber}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap mb-1">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Order{" "}
                                    <span className="text-primary ">
                                        #{item.orderReferenceNumber}
                                    </span>
                                </h1>
                                {item.isCustomJob && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs rounded-full"
                                    >
                                        Custom Job
                                    </Badge>
                                )}
                                {canceledItems.length > 0 && (
                                    <Badge className="text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10">
                                        {canceledItems.length} item
                                        {canceledItems.length > 1
                                            ? "s"
                                            : ""}{" "}
                                        cancelled
                                    </Badge>
                                )}
                                <a
                                    href={`${import.meta.env.VITE_BASE_URL}order/download?id=${orderId}`}
                                    download={true}
                                >
                                    <Button size="sm">
                                        Download <Download />
                                    </Button>
                                </a>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatIST(item.orderDate)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Stat Cards ──────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <StatCard
                        icon={ReceiptText}
                        label="Grand Total"
                        value={fmt(item?.totalAmount ?? 0)}
                        accent
                    />
                    <StatCard
                        icon={Truck}
                        label={`Shipping`}
                        subLabel={`${item.shippingMethod}`}
                        value={
                            item.totalShippingAmount > 0
                                ? `${fmt(item.totalShippingAmount)}`
                                : ""
                        }
                        sub="across all items"
                    />
                    <StatCard
                        icon={Hash}
                        label="Payment Method"
                        value={item.paymentMode}
                        sub={"Payment mode"}
                    />
                    {/* {item.approvedBy.value && (
                        <StatCard
                            icon={UserCheck}
                            label="Approved By"
                            value={item.approvedBy.label}
                            sub={item.remarks}
                            className='w-full md:col-span-2'
                        />
                    )} */}
                </div>

                {/* ── Billing Address ────────────────────────────────────────── */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <SectionHeader icon={MapPin} title="Billing Address" />
                    <div className="px-5 py-5 grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                Contact Person
                            </p>
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {billingAddress.contactPersonName}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                        <Phone className="h-3 w-3" />
                                        {billingAddress.mobileNo}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                Billing Address
                            </p>
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {billingAddressParts.join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Shipping Address ────────────────────────────────────────── */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <SectionHeader icon={MapPin} title="Delivery Address" />
                    <div className="px-5 py-5 grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                Contact Person
                            </p>
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {shippingAddress.contactPersonName}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                        <Phone className="h-3 w-3" />
                                        {shippingAddress.mobileNo}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                Shipping Address
                            </p>
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {shippingAddressParts.join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Active Items Table ───────────────────────────────────────── */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <SectionHeader
                        icon={Package}
                        title="Order Items"
                        right={
                            <span className="text-xs  text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                                {activeItems.length} item
                                {activeItems.length !== 1 ? "s" : ""}
                            </span>
                        }
                    />
                    <div className="overflow-x-auto">
                        <Table className="h-fit">
                            <ItemsTableHead />
                            <TableBody>
                                {activeItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            className="text-center py-12 text-muted-foreground text-sm"
                                        >
                                            No active items in this order.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activeItems.map((lineItem) => (
                                        <ActiveItemRow
                                            key={lineItem.id}
                                            lineItem={lineItem}
                                            fetchOrderDetailsAsync={
                                                fetchOrderDetailsAsync
                                            }
                                            isPaymentSucceeded={
                                                item.isPaymentSucceeded
                                            }
                                            isCustomJob={item.isCustomJob}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Totals Footer */}
                    <div className="border-t border-border bg-muted/20 px-5 py-4">
                        <div className="flex justify-end">
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Product Amount</span>
                                    <span className="">{fmt(grandTotal)}</span>
                                </div>
                                {/* <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="">{fmt(totalSubtotal)}</span>
                                </div> */}
                                {/* <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="">
                                        {item.totalShippingAmount > 0 ? fmt(item.totalShippingAmount) : 'Free'}
                                    </span>
                                </div> */}
                                <div className="h-px bg-border my-1" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold">
                                        Grand Total
                                    </span>
                                    <span className=" text-lg font-bold text-primary">
                                        {fmt(grandTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Cancelled Items Table (only shown when there are cancellations) ── */}
                {canceledItems.length > 0 && (
                    <div className="rounded-2xl border border-destructive/20 bg-card overflow-hidden">
                        <SectionHeader
                            icon={Ban}
                            title="Cancelled Items"
                            variant="destructive"
                            right={
                                <span className="text-xs  text-destructive/70 bg-destructive/10 border border-destructive/15 px-2.5 py-1 rounded-lg">
                                    {canceledItems.length} item
                                    {canceledItems.length !== 1 ? "s" : ""}
                                </span>
                            }
                        />
                        <div className="overflow-x-auto">
                            <Table>
                                <ItemsTableHead />
                                <TableBody>
                                    {canceledItems.map((lineItem) => (
                                        <CancelledItemRow
                                            key={lineItem.id}
                                            isCustomJob={item.isCustomJob}
                                            lineItem={lineItem}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Cancelled totals summary */}
                        <div className="border-t border-destructive/15 bg-destructive/2 px-5 py-3">
                            <div className="flex justify-end">
                                <div className="w-full max-w-xs space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-destructive/60 mb-2">
                                        Refunded
                                    </p>
                                    <div className="flex justify-between text-sm text-muted-foreground/70">
                                        <span>Items Total</span>
                                        <span className=" line-through">
                                            {fmt(
                                                canceledItems.reduce(
                                                    (s, i) => s + i.grandTotal,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                    <div className="h-px bg-destructive/10 my-1" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-destructive/70">
                                            Cancelled Total
                                        </span>
                                        <span className=" text-base font-bold text-destructive/70 line-through">
                                            {fmt(
                                                canceledItems.reduce(
                                                    (s, i) => s + i.grandTotal,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
