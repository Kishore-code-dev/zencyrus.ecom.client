import { Outlet } from "react-router"

export default function AppProtectedLayout()
{
    // All routes are publicly accessible — no authentication required for free demo
    return <Outlet />
}
