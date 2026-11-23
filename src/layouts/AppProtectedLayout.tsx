import { useAuth } from "@/hooks/use-auth"
import { Navigate, Outlet } from "react-router"

export default function AppProtectedLayout()
{
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated)
    {
        return <Navigate to={`/auth/login?redirect=${window.location.search}`} replace />
    }

    return <Outlet />
}
