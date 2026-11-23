import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export default function FallBackSkeleton()
{
    const { theme } = useTheme()
    return (
        <div className="h-screen w-full grid grid-cols-1 gap-2.5">
            <div className={cn("flex items-center gap-2 m-auto")}>
                <img
                    loading="lazy"
                    decoding="async" src={theme == "light" ? '/images/logo.light.png' : '/images/logo.dark.png'}
                    alt="Shree Maruthi Printers"
                    className="size-32 w-auto"
                />
                <div className="">
                    <h1 className="font-display text-xl font-bold text-foreground">Shree Maruthi Printers</h1>
                    <p className="text-xs text-muted-foreground">B2B Printing Solutions</p>
                </div>
            </div>
        </div>
    )
}
