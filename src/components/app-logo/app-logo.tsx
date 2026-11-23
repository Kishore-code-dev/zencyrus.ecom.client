import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

interface AppLogoProps extends ComponentProps<'div'>
{

}

export default function AppLogo({ className, ...props }: AppLogoProps)
{
    const { theme } = useTheme()
    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            <img
                loading="lazy"
                decoding="async"
                src={theme == "light" ? '/images/logo.light.png' : '/images/logo.dark.png'}
                alt="Shree Maruthi Printers"
                className="h-12 w-auto bg-cover"
            />
            <div className="hidden">
                <h1 className="font-display text-xl font-bold text-foreground">Shree Maruthi Printers</h1>
                <p className="text-xs text-muted-foreground">B2B Printing Solutions</p>
            </div>
        </div>
    )
}
