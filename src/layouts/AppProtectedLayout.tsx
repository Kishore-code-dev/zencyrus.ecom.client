import { useAuth } from "@/hooks/use-auth"
import { Navigate, Outlet, useLocation } from "react-router"

export default function AppProtectedLayout()
{
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated)
    {
        const redirect = `${location.pathname}${location.search}`
        return <Navigate to={`/auth/login?redirect=${encodeURIComponent(redirect)}`} replace />
    }

    return <Outlet />
}
