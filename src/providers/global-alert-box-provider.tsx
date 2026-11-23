import { createContext, useEffect, useState } from "react"
import { type PropsWithChildren } from "react"
import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogContent, AlertDialogAction, AlertDialogFooter } from "@/components/ui/alert-dialog"
import type { DialogBox } from "@/types/api-action"
import type { GlobalAlertBoxContextType } from "@/types/global-alert-box"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DynamicIcon } from "lucide-react/dynamic"

export const GlobalAlertBoxContext = createContext<GlobalAlertBoxContextType | null>(null)

export default function GlobalAlertBoxProvider({ children }: PropsWithChildren)
{
    const [open, setOpen] = useState<boolean>(false)
    const [dialogBox, setDialogBox] = useState<DialogBox | null>(null)

    useEffect(() =>
    {
        if (!dialogBox) return;
        setOpen(!!dialogBox)
    }, [dialogBox])

    return (
        <GlobalAlertBoxContext.Provider value={{ setDialogBox, dialogBox }}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    {dialogBox && (
                        <AlertDialogHeader>
                            <AlertDialogTitle>{dialogBox.message.category}</AlertDialogTitle>
                            <AlertDialogDescription>{dialogBox.message.description}</AlertDialogDescription>
                        </AlertDialogHeader>
                    )}
                    {dialogBox && (
                        <Alert>
                            <DynamicIcon name={dialogBox.icon} />
                            <AlertTitle>{dialogBox.message.category}</AlertTitle>
                            <AlertDescription>{dialogBox.action}</AlertDescription>
                        </Alert>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setDialogBox(null)}>Ok</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </GlobalAlertBoxContext.Provider>
    )
}