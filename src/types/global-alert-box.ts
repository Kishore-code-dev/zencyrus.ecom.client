import type { Dispatch, SetStateAction } from "react";
import type { DialogBox } from "./api-action";

export interface GlobalAlertBoxContextType
{
    dialogBox: DialogBox | null
    setDialogBox: Dispatch<SetStateAction<DialogBox | null>>
} 