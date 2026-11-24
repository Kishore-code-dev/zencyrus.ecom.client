import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

interface AppLogoProps extends Omit<ComponentProps<"img">, "src" | "alt">
{

}

/**
 * Official Gokul Printers logo.
 *
 * The logo artwork is kept exactly as supplied (see /public/images/logo.png).
 * The white plate is part of the artwork, so the rounded corners keep it tidy
 * when the app is viewed in dark mode.
 */
export default function AppLogo({ className, ...props }: AppLogoProps)
{
    return (
        <img
            src="/images/logo.png"
            alt="Gokul Printers — AN ISO 9001:2008 Certified Company"
            width={431}
            height={120}
            decoding="async"
            className={cn("h-12 w-auto rounded-md bg-white", className)}
            {...props}
        />
    )
}
