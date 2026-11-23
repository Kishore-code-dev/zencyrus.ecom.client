import type { Dispatch, ReactNode, SetStateAction } from "react"
import type { DataType, mode, OptionItem, PagedResults, RowData } from "./common"
import type { SortingState, ColumnFiltersState, Table, ColumnDef, ColumnPinningState } from "@tanstack/react-table"


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
    | 'image'


export type DataGridMode = 'DEFAULT_DATA_GRID' | 'DIALOG_FORM_DATA_GRID' | 'INLINE_DATA_GRID'

export interface DataGridProviderProps
{
    path: string
    viewId: string
    defaultFilters?: ColumnFiltersState
    defaultSorting?: SortingState
    defaultValue?: RowData
    defaultColumnPinning?: ColumnPinningState
    children?: ReactNode
    defaultColumns?: ColumnDef<RowData>[]
}

export interface DataGridRender
{
    id: string
    open: boolean
    action: 'create' | 'update' | 'none'
}

export interface DataGridProps extends DataGridProviderProps
{

}

export interface DataGridConfiguration
{
    mode: DataGridMode
    title: string
    description: string
    submissionUrl: string
    permissions: string[]
    columns: Column[]
    objectId: string
    isNeedCheckbox: boolean
    placeholder: string
}

export interface DataGridState extends DataGridConfiguration
{
    path: string
    viewId: string
    payload: FetchPagedResultPayload
    pagedResult: PagedResults<RowData>
}

export enum DataGridActionEnum
{
    UPDATE_DATA_GRID_CONFIGURATION = "UPDATE_DATA_GRID_CONFIGURATION",
    UPDATE_PAGED_RESULT = "UPDATE_PAGED_RESULT",
    UPDATE_PAGED_RESULT_PAYLOAD = "UPDATE_PAGED_RESULT_PAYLOAD",
    UPDATE_CELL = "UPDATE_CELL",
    DELETE_ROWS = "DELETE_ROWS",
    ADD_ROWS = "ADD_ROWS",
    SET_INITIAL_STATE = "SET_INITIAL_STATE",
}

export enum DataGridPermissionEnum
{
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    VIEW_SINGLE_ROW = "VIEW_SINGLE_ROW",
    EXPORT_DATA = "EXPORT_DATA",
    VIEW_SELECT = "VIEW_SELECT"
}


export interface DataGridCellPayload
{
    rowId: string
    dataType: DataType
    columnName: string
    columnValue: any
}

export type DataGridDispatch =
    | {
        type: DataGridActionEnum.ADD_ROWS
        payload: RowData
    }
    | {
        type: DataGridActionEnum.DELETE_ROWS
        payload: string[]
    }
    | {
        type: DataGridActionEnum.UPDATE_CELL
        payload: DataGridCellPayload
    }
    | {
        type: DataGridActionEnum.UPDATE_DATA_GRID_CONFIGURATION,
        payload: DataGridConfiguration
    }
    | {
        type: DataGridActionEnum.UPDATE_PAGED_RESULT
        payload: PagedResults<RowData>
    }
    | {
        type: DataGridActionEnum.UPDATE_PAGED_RESULT_PAYLOAD
        payload: FetchPagedResultPayload
    }
    | {
        type: DataGridActionEnum.SET_INITIAL_STATE,
        payload: { path: string, viewId: string }
    }

export interface DataGridContextValue extends DataGridState
{
    dataGridDef: Table<RowData>
    loading: boolean
    fetchPagedResultAsync: (payload: FetchPagedResultPayload) => Promise<void>
    fetchDataGridConfigurationAsync: (viewId: string) => Promise<void>
    handleSubmitAsync: (payload: any) => Promise<void>
    isRender: DataGridRender
    setRender: Dispatch<SetStateAction<DataGridRender>>
    defaultValue?: RowData
}

export interface FetchPagedResultPayload
{
    viewId: string
    sorting: SortingState
    columnFilters: ColumnFiltersState
    searchString: string
    pageNumber: number
    pageSize: number
}