import { Skeleton } from "../ui/skeleton";

export default function CartItemSkeleton()
{
    return (
        <div className="h-fit rounded-md grid grid-cols-5 border border-border p-6 shadow-soft">
            <div className="col-span-1">
                <Skeleton className="size-24 shrink-0 overflow-hidden rounded-lg" />
            </div>
            <div className="grid grid-cols-1 col-span-4 gap-2.5">
                <div className="font-display text-lg font-semibold space-y-2.5">
                    <Skeleton className="h-5 w-md rounded-xs" />
                    <Skeleton className="h-5 w-xs rounded-xs" />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                    <Skeleton className="h-5 rounded-xs" />
                    <Skeleton className="h-5 rounded-xs" />
                    <Skeleton className="h-5 rounded-xs" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    <Skeleton className="h-5 w-20 rounded-xs mr-auto" />
                    <Skeleton className="h-5 w-36 rounded-xs ml-auto" />
                </div>
            </div>
        </div>
    )
}
