import type { Dispatch, ReactNode, SetStateAction } from "react"
import type { DataType, mode, OptionItem, RowData } from "./common"
import type { SortingState, ColumnFiltersState, Table, ColumnDef, ColumnPinningState } from "@tanstack/react-table"

export interface PagedResult<T>
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

export interface Column
{
    accessorKey: string
    header: string
    enableSorting: boolean
    enableColumnFilter: boolean
    enableGlobalFilter: boolean
    enableColumnPinning: boolean
    enableColumnResizing: boolean
    size: number
    meta: ColumnMeta
}

export interface ColumnMeta
{
    baseUrl: string
    path: string;
    mode: mode
    dataType: DataType
    variant: Variant
    defaultValue: any
    alias: string
    options: OptionItem[];
    renderType: ColumnRenderType
}

export type ColumnRenderType =
    | 'text'
    | 'date'
    | 'time'
    | 'html'
    | 'avatar'
    | 'badge'
    | 'chart'
    | 'file'
    | 'icon'
    | 'boolean'
    | 'progressbar'
    | 'link'
    | 'navigation'

export type PagedResultMode = 'DEFAULT_DATA_GRID' | 'DIALOG_FORM_DATA_GRID' | 'INLINE_DATA_GRID'

export interface PagedResultProviderProps
{
    path: string
    viewId: string
    defaultFilters?: ColumnFiltersState
    defaultSorting?: SortingState
    defaultValue?: RowData
    defaultColumnPinning?: ColumnPinningState
    children?: ReactNode
    defaultColumns?: ColumnDef<RowData>[]
    pageSize?: number
}

export interface PagedResultRender
{
    id: string
    open: boolean
    action: 'create' | 'update' | 'none'
}

export interface PagedResultProps extends PagedResultProviderProps
{

}

export interface PagedResultConfiguration
{
    mode: PagedResultMode
    title: string
    description: string
    submissionUrl: string
    permissions: string[]
    columns: Column[]
    objectId: string
}

export interface PagedResultState extends PagedResultConfiguration
{
    path: string
    viewId: string
    payload: PagedResultPayload
    pagedResult: PagedResult<RowData>
}

export enum PagedResultActionEnum
{
    UPDATE_DATA_GRID_CONFIGURATION = "UPDATE_DATA_GRID_CONFIGURATION",
    UPDATE_PAGED_RESULT = "UPDATE_PAGED_RESULT",
    UPDATE_PAGED_RESULT_PAYLOAD = "UPDATE_PAGED_RESULT_PAYLOAD",
    UPDATE_CELL = "UPDATE_CELL",
    DELETE_ROWS = "DELETE_ROWS",
    ADD_ROWS = "ADD_ROWS",
    SET_INITIAL_STATE = "SET_INITIAL_STATE",
}

export enum PagedResultPermissionEnum
{
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    VIEW_SINGLE_ROW = "VIEW_SINGLE_ROW",
    EXPORT_DATA = "EXPORT_DATA",
    VIEW_SELECT = "VIEW_SELECT"
}

export interface PagedResultCellPayload
{
    rowId: string
    dataType: DataType
    columnName: string
    columnValue: any
}

export type PagedResultDispatch =
    | {
        type: PagedResultActionEnum.ADD_ROWS
        payload: RowData
    }
    | {
        type: PagedResultActionEnum.DELETE_ROWS
        payload: string[]
    }
    | {
        type: PagedResultActionEnum.UPDATE_CELL
        payload: PagedResultCellPayload
    }
    | {
        type: PagedResultActionEnum.UPDATE_DATA_GRID_CONFIGURATION,
        payload: PagedResultConfiguration
    }
    | {
        type: PagedResultActionEnum.UPDATE_PAGED_RESULT
        payload: PagedResult<RowData>
    }
    | {
        type: PagedResultActionEnum.UPDATE_PAGED_RESULT_PAYLOAD
        payload: PagedResultPayload
    }
    | {
        type: PagedResultActionEnum.SET_INITIAL_STATE,
        payload: { path: string, viewId: string }
    }

export interface PagedResultContextValue extends PagedResultState
{
    pagedResultDef: Table<RowData>
    loading: boolean
    fetchPagedResultAsync: (payload: PagedResultPayload) => Promise<void>
    fetchPagedResultConfigurationAsync: (viewId: string) => Promise<void>
    isRender: PagedResultRender
    setRender: Dispatch<SetStateAction<PagedResultRender>>
    defaultValue?: RowData
}

export interface PagedResultPayload
{
    viewId: string
    sorting: SortingState
    columnFilters: ColumnFiltersState
    searchString: string
    pageNumber: number
    pageSize: number
}