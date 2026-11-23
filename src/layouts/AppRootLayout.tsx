import { Outlet } from "react-router"
import { Header } from "@/components/Headers/Header"
import { Footer } from "@/components/Footer"
import NavItem from "@/components/nav-item/nav-item"
import { useAuth } from "@/hooks/use-auth"

export default function AppRootLayout()
{
    const { isAuthenticated } = useAuth()
    return (
        <>
            <Header />
            {isAuthenticated && <NavItem />}
            <Outlet />
            <Footer />
        </>
    )
}