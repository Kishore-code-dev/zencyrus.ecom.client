import { Skeleton } from "../ui/skeleton"


const SKELETON_ARRAY = Array.from({ length: 8 })

export default function NavItemSkeleton()
{
    return (
        <div className="grid grid-cols-8 gap-2">
            {SKELETON_ARRAY.map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xs" />
            ))}
        </div>
    )
}
