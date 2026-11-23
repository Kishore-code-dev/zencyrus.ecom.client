import { type FC } from 'react'
import { Combobox, type ComboboxProps } from "@/components/ui/combobox"
import { DynamicIcon } from 'lucide-react/dynamic'

const IconPicker: FC<ComboboxProps> = (({ ref, ...props }) => (
    <Combobox
        ref={ref}
        path='icon/search?searchString'
        mode='dynamic'
        renderItem={(item) => (
            <span>
                <DynamicIcon name={item.value} />
                <span>{item.label}</span>
            </span>
        )}
        {...props}
    />
))


export { IconPicker }