import type { IconName } from "lucide-react/dynamic"
import type { PropsWithChildren } from "react"

export interface StatusCard extends PropsWithChildren{
    label: string
    helpterText: string
    value: any
    loading: boolean
    iconName: IconName
    className?: string
}