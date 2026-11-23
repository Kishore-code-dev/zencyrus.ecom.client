import { useCustomJob } from '@/hooks/use-custom-job'
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { Upload, X } from 'lucide-react'
import
{
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";



export default function CustomQuoteDocuments()
{
    const { customJobCheckoutForm } = useCustomJob()


    return (
        <FormField
            control={customJobCheckoutForm.control}
            name='attachment'
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>Attchment <span className='text-destructive'>*</span></FormLabel>
                    <FileUpload
                        maxFiles={8}
                        maxSize={5 * 1024 * 1024}
                        className="w-full"
                        value={field.value}
                        onValueChange={field.onChange}
                        onFileReject={(_, message) =>
                        {
                            customJobCheckoutForm.setError("attachment", { message })
                        }}
                        multiple
                    >
                        <FileUploadDropzone>
                            <div className="flex flex-col items-center gap-1 text-center w-full">
                                <div className="flex items-center justify-center rounded-full border p-2.5">
                                    <Upload className="size-6 text-muted-foreground" />
                                </div>
                                <p className="font-medium text-sm">Drag & drop files here</p>
                                <p className="text-muted-foreground text-xs">
                                    Or click to browse (up to 100MB each)
                                </p>
                            </div>
                            <FileUploadTrigger asChild>
                                <Button variant="outline" size="sm" className="mt-2 w-fit">
                                    Browse files
                                </Button>
                            </FileUploadTrigger>
                        </FileUploadDropzone>
                        <FileUploadList>
                            {Array.isArray(field.value)
                                && field.value.map((file, index) => (
                                    <FileUploadItem key={index} value={file}>
                                        <FileUploadItemPreview />
                                        <FileUploadItemMetadata />
                                        <FileUploadItemDelete asChild>
                                            <Button variant="ghost" size="icon" className="size-7">
                                                <X />
                                            </Button>
                                        </FileUploadItemDelete>
                                    </FileUploadItem>
                                ))}
                        </FileUploadList>
                    </FileUpload>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
