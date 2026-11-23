import { FileUpload, FileUploadDropzone, FileUploadTrigger } from "@/components/ui/file-upload";
import { useState, useRef, type ComponentProps } from "react";
import
{
    ACCEPTED_TYPES,
    designFileSchema,
    MAX_FILES,
    MAX_SIZE,
    ValidateDPISeverSideAsync,
    type DesignFileSchemaType,
    type DPIResponse,
} from "@/config/validate-design-file";
import { useFormContext, useWatch } from "react-hook-form";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // shadcn progress
import type z from "zod";
import { Label } from "../ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog"

interface DesignFileUploadProps extends ComponentProps<typeof FileUpload>
{
    finishHeight: number;
    finishWidth: number;
    imageTypeId: string;
    name: string;
    imageTypeName: string;
    cellCount: number;
    previousHeight: number
    previousWidth: number
}

export default function DesignFileUpload({
    name,
    finishHeight,
    finishWidth,
    imageTypeId,
    imageTypeName,
    maxFiles = MAX_FILES,
    maxSize = MAX_SIZE,
    accept = ACCEPTED_TYPES.join(","),
    previousHeight = 53,
    previousWidth = 90,
    cellCount = 0,
    ...props
}: DesignFileUploadProps)
{
    const { control, setError, clearErrors, setValue } = useFormContext();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isRgb, setIsRgb] = useState<File | null>(null)
    const [dpiResponse, setDpiResponse] = useState<DPIResponse | null>(null)
    const isProcessing = useRef(false);

    const document = useWatch({
        control,
        name,
    }) as DesignFileSchemaType;

    const startProgress = () =>
    {
        setProgress(0);
        const interval = setInterval(() =>
        {
            setProgress((prev) =>
            {
                if (prev >= 85)
                {
                    clearInterval(interval);
                    return 85;
                }
                return prev + 10;
            });
        }, 180);
        return interval;
    };

    const handleValueChange = async (file: File[]) =>
    {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setLoading(true);

        const progressInterval = startProgress();

        try
        {
            const response = await ValidateDPISeverSideAsync(file, finishHeight, finishWidth, cellCount, previousHeight, previousWidth);
            clearInterval(progressInterval);
            setProgress(100);

            if (response && !response.isValid)
            {
                if (response.message.includes('Only CMYK color space files are accepted'))
                {
                    setMessage(response.message)
                    setOpen(true)
                    setIsRgb(file[0])
                    setDpiResponse(response)
                }
                else
                {
                    setError(`${name}.document`, {
                        message: response.message,
                    });
                }
                setFiles([]);
            } else
            {
                const data: z.infer<typeof designFileSchema> = {
                    cellCount: response.cellCount,
                    documentHeightInMM: response.documentHeightInMM,
                    documentHeightInPx: response.documentHeightInPx,
                    documentWidthInMM: response.documentWidthInMM,
                    documentWidthInPx: response.documentWidthInPx,
                    document: file[0],
                    imageTypeId,
                    imageTypeName,
                    isValid: response.isValid,
                    currentDPI: response.currentDPI,
                    extraChannels: response.extraChannels,
                    totalChannels: response.totalChannels,
                    colorSpace: response.colorSpace,
                    imageUrl: response.imageUrl
                };
                setValue(name, data);
                setFiles([]);
                clearErrors(name);
            }
        } catch (err)
        {
            clearInterval(progressInterval);
            setError(`${name}.document`, { message: "Validation failed. Please try again." });
        } finally
        {
            setTimeout(() =>
            {
                setLoading(false);
                setProgress(0);
                isProcessing.current = false
            }, 400);
        }
    };

    return (
        <FileUpload
            maxFiles={maxFiles}
            accept={accept}
            maxSize={maxSize}
            value={files}
            className="w-full"
            onValueChange={handleValueChange}
            onFileReject={(_, message) =>
            {
                setError(name, { message });
            }}
            {...props}
        >
            {!document?.isValid && (
                <Label>
                    {imageTypeName} <span className="text-destructive">*</span>
                </Label>
            )}

            {!document?.isValid && !loading && (
                <FileUploadDropzone className="h-40 w-full">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-xs">Drag & drop files here</p>
                        <p className="text-muted-foreground text-xs">
                            Or click to browse
                        </p>
                    </div>
                    <FileUploadTrigger disabled={loading} asChild>
                        <Button variant="outline" size="sm" className="mt-2 w-fit px-2 py-1 text-xs">
                            Browse files
                        </Button>
                    </FileUploadTrigger>
                </FileUploadDropzone>
            )}

            {loading && (
                <div className="mt-3 flex flex-col gap-1.5">
                    <p className="text-muted-foreground text-xs">Validating DPI & Color Specification...</p>
                    <Progress value={progress} className="h-2 w-full transition-all duration-200" />
                </div>
            )}
            <AlertDialog
                open={open}
                onOpenChange={(value) =>
                {
                    if (!value)
                    {
                        setMessage("")
                    }
                    setOpen(value)
                }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>File Format Warning</AlertDialogTitle>
                        <AlertDialogDescription>{message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                            {
                                setIsRgb(null);
                                setDpiResponse(null)
                                setOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                            {
                                if (isRgb && dpiResponse)
                                {
                                    const data: z.infer<typeof designFileSchema> = {
                                        cellCount: dpiResponse.cellCount,
                                        documentHeightInMM: dpiResponse.documentHeightInMM,
                                        documentHeightInPx: dpiResponse.documentHeightInPx,
                                        documentWidthInMM: dpiResponse.documentWidthInMM,
                                        documentWidthInPx: dpiResponse.documentWidthInPx,
                                        document: isRgb,
                                        imageTypeId,
                                        imageTypeName,
                                        isValid: true,
                                        currentDPI: dpiResponse.currentDPI,
                                        extraChannels: dpiResponse.extraChannels,
                                        totalChannels: dpiResponse.totalChannels,
                                        colorSpace: dpiResponse.colorSpace,
                                        imageUrl: dpiResponse.imageUrl
                                    };
                                    setValue(name, data);
                                }
                                setIsRgb(null);
                                setDpiResponse(null)
                                setOpen(false)
                            }}
                        >
                            Proceed
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </FileUpload>
    );
}