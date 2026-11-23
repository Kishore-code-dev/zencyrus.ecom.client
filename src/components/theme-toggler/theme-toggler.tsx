import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "../ui/button"



export default function ThemeToggler()
{
    const { theme, setTheme } = useTheme()

    return (
        <Button size='icon' variant='outline' onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>
            {theme == "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}