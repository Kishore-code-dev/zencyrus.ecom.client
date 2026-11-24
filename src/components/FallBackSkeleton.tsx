import AppLogo from "@/components/app-logo/app-logo";

export default function FallBackSkeleton()
{
    return (
        <div className="h-screen w-full grid grid-cols-1 gap-2.5">
            <div className="m-auto flex flex-col items-center gap-3">
                <AppLogo className="h-14" fetchPriority="high" />
                <p className="text-xs text-muted-foreground animate-pulse">
                    Loading…
                </p>
            </div>
        </div>
    )
}
