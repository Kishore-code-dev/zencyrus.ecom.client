import { CustomJobProviderContext } from "@/providers/customjob-provider"
import { useContext } from "react"

export function useCustomJob()
{
    const context = useContext(CustomJobProviderContext)

    if (!context)
    {
        throw new Error("useCustomJob must be used within a CustomJobProvider")
    }

    return context
}