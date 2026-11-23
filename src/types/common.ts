import type { IconName } from "lucide-react/dynamic"

export interface OptionItem
{
    label: string
    value: any
}

export interface PriceOptionItem extends OptionItem
{
    price: number
}

export interface OtherSpecificationPriceOptionItem extends PriceOptionItem
{
    minQuantity: number
}

export interface ImageOptionItem extends OptionItem
{
    description: string
}

export interface DimensionOptionItem extends OptionItem
{
    height: number
    width: number
}

export interface AttachmentOptionItem extends OptionItem
{
    height: number
    width: number
}

export type RowData = {
    id: string
    [key: string]: any | OptionItem
}

export type DataType =
    | "text"
    | "numeric"
    | "boolean"
    | "array"
    | "date"
    | "time"
    | "file"
    | "html"
    | 'currency'
    | "json"
    | "decimal"

export type mode = "static" | "dynamic"


export interface SidebarMenuItem
{
    id: string
    icon: IconName
    label: string
    variant: string
    dataType: string
    displayOrder: number
    isTable: boolean
}

export type Variant =
    | "table"
    | "text"
    | "textarea"
    | "numeric"
    | "email"
    | "password"
    | "date"
    | "time"
    | "toggle"
    | "checkbox"
    | "radio"
    | "multicheckbox"
    | "range"
    | "select"
    | "combobox"
    | "multiselect"
    | "taginput"
    | "signature"
    | "fileupload"
    | "phone"
    | "iconpicker"
    | "link"
    | "color"
    | "richtexteditor"
    | "rating"

export interface PagedResults<T>
{
    items: T[]
    totalItems: number
    maxNavigationPages: number
    pageNumber: number
    pageSize: number
    totalPages: number
    startPage: number
    endPage: number
    pageNumbers: number[]
}

export interface OptionItem
{
    label: string
    value: any
}

export interface QuantityOptionItem extends OptionItem
{
    quantity: number
}

export interface ProductOptionItem extends OptionItem
{
    quantityId: string
    isShown: boolean
}

export interface MachinePriceOptionItem extends OptionItem
{
    machineId: string
    price: number
}

export interface GroupOptionItem
{
    group: OptionItem
    groupItems: OptionItem[]
}