import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Eye, RotateCcw } from "lucide-react";
import DesignFilePreview from "./DesignFilePreview";
import { useState, type ComponentProps } from "react";
import type { DesignFileSchemaType } from "@/config/validate-design-file";

interface DesignFlieFlipDialogProps extends ComponentProps<typeof Dialog>
{
    designFiles: DesignFileSchemaType[]
}

export default function DesignFlieFlipDialog({ designFiles = [], ...props }: DesignFlieFlipDialogProps)
{
    const [index, setIndex] = useState<number>(0)
    const [currentDesignFile, setCurrentDesignFile] = useState<DesignFileSchemaType>(designFiles[index])

    const handleOnClick = () =>
    {
        if (index == designFiles.length - 1)
        {
            setIndex(0)
            setCurrentDesignFile(designFiles[0])
        }
        else
        {
            setCurrentDesignFile(designFiles[index + 1])
            setIndex(index + 1)

        }
    }

    return (
        <Dialog {...props}>
            <DialogTrigger asChild>
                <Button size='lg' className="w-full rounded-md">
                    <Eye />  Preview Design
                </Button>
            </DialogTrigger>
            <DialogContent
                style={{ width: "fit-content", maxWidth: "95vw" }}
                className="flex flex-col items-center gap-0 p-6 overflow-visible transition-all"
            >
                {currentDesignFile && currentDesignFile.document && (
                    <DesignFilePreview
                        documentHeightInMM={currentDesignFile.documentHeightInMM}
                        documentHeightInPx={currentDesignFile.documentHeightInPx}
                        documentWidthInMM={currentDesignFile.documentWidthInMM}
                        documentWidthInPx={currentDesignFile.documentWidthInPx}
                        cellCount={currentDesignFile.cellCount}
                        colorSpace={currentDesignFile.colorSpace as string}
                        fileType={currentDesignFile.imageTypeName}
                        imageUrl=""
                    />
                )}
                <Button onClick={handleOnClick} className="mt-5">
                    <RotateCcw /> Filp {index == 0 ? "back" : "front"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
