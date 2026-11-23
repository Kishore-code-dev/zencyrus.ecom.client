import { AuthProviderContext } from "@/providers/auth-provider"
import { useContext } from "react"

export function useAuth()
{
    const context = useContext(AuthProviderContext)

    if (!context)
    {
        throw new Error("useAuth must be used within a AuthProvider")
    }

    return context
}