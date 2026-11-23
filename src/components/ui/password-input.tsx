import { InputGroup, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import { Eye, EyeOff } from "lucide-react"
import { useState, type ComponentProps } from "react"


interface PasswordInputProps extends ComponentProps<typeof InputGroupInput>
{

}
export default function PasswordInput({ ...props }: Omit<PasswordInputProps, 'type'>)
{
    const [type, setType] = useState<"password" | "text">("password")
    const handleToggle = () =>
    {
        setType(pre => pre == "password" ? "text" : "password")
    }

    return (
        <InputGroup>
            <InputGroupInput type={type} {...props} />
            <InputGroupButton
                type="button"
                size="icon-sm"
                onClick={handleToggle}
            >
                {type === "password" ? <EyeOff /> : <Eye />}
            </InputGroupButton>
        </InputGroup>
    )
}
