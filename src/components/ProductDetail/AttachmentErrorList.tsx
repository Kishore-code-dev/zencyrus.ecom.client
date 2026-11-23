import { useFormContext } from "react-hook-form"

export function AttachmentErrorList()
{
    const { formState } = useFormContext()
    const errorMessage = formState.errors.attachments?.message as string | undefined

    if (!errorMessage) return null

    const errors = errorMessage.split("|").filter(Boolean)

    if (errors.length === 0) return null

    return (
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-destructive">
            {errors.map((message, index) => (
                <li key={index}>{message}</li>
            ))}
        </ul>
    )
}