import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/config/api'
import { dataGridReducer, initialValue } from '@/config/data-grid'
import { useApiAction } from '@/hooks/use-api-action'
import type { RowData } from '@/types/common'
import { DataGridActionEnum, type DataGridContextValue, type DataGridProviderProps, type DataGridRender, type FetchPagedResultPayload } from '@/types/data-grid'
import { type ColumnFiltersState, type ColumnSizingState, type RowSelectionState, type SortingState, type ColumnPinningState, type PaginationState, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useMemo, useReducer, useState, useTransition } from 'react'
import { toast } from 'sonner'

export const DataGridContextProvider = createContext<DataGridContextValue | null>(null)

export const tableRowSelectionCheckboxCell: ColumnDef<RowData> = {
    id: "id",
    accessorKey: 'id',
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="m-auto"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="m-auto"
        />
    ),
    size: 35,
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false
}

function DataGridProvider({
    path = "",
    viewId = "",
    defaultFilters = [],
    defaultSorting = [],
    defaultColumns = [],
    defaultColumnPinning = { left: [], right: [] },
    defaultValue,
    children
}: DataGridProviderProps)
{
    const [state, dispatch] = useReducer(dataGridReducer, initialValue)
    const [sorting, setSorting] = useState<SortingState>([...defaultSorting])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([...defaultFilters])
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ['id', ...defaultColumnPinning.left as string[]],
        right: [...defaultColumnPinning.right as string[]]
    })
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 10, pageIndex: 1 })
    const [loading, startTransition] = useTransition()
    const [isRender, setRender] = useState<DataGridRender>({
        id: "",
        open: false,
        action: 'none'
    })
    const dataGridDef = useReactTable<RowData>({
        data: [...state.pagedResult.items],
        columns: [...state.columns, ...defaultColumns],
        state: {
            sorting,
            columnFilters,
            columnPinning,
            columnSizing,
            rowSelection,
            pagination
        },
        getRowId: (row) => row.id,
        columnResizeMode: "onChange",
        pageCount: state.pagedResult.totalPages + 1,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnSizingChange: setColumnSizing,
        onColumnPinningChange: setColumnPinning,
        onPaginationChange: setPagination,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true
    })

    const { apiActionAsync } = useApiAction()

    const fetchPagedResultAsync = useCallback(async (payload: FetchPagedResultPayload) =>
    {
        startTransition(async () =>
        {
            try
            {
                const pageNumber = payload.pageNumber == 0 ? 1 : payload.pageNumber
                const response = await api.post(`${path}/pagedresult?pageSize=${payload.pageSize}&pageNumber=${pageNumber}&searchString=${payload.searchString}&viewId=${payload.viewId}`, payload);
                if (response.status == 200 && response.data)
                {
                    dispatch({ type: DataGridActionEnum.UPDATE_PAGED_RESULT, payload: response.data });
                    dispatch({ type: DataGridActionEnum.UPDATE_PAGED_RESULT_PAYLOAD, payload })
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })
    }, [])

    const fetchDataGridConfigurationAsync = useCallback(async (viewId: string) =>
    {
        startTransition(async () =>
        {
            try
            {
                const response = await api.get(`corefuncationality/views/config?viewId=${viewId}`)
                if (response.status == 200 && response.data)
                {
                    dispatch({ type: DataGridActionEnum.UPDATE_DATA_GRID_CONFIGURATION, payload: response.data })
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })
    }, [])

    const handleSubmitAsync = useCallback(async (payload: RowData) =>
    {
        toast.promise(
            api.post(`${state.path}/${isRender.action}?id=${isRender.id}&viewId=${state.viewId}`, payload),
            {
                loading: `loading...`,
                success: async (response) =>
                {
                    if (response.status == 200 && response.data)
                    {
                        setRender(() => ({ id: "", action: "none", open: false }))
                        dataGridDef.setRowSelection({})
                        await fetchPagedResultAsync(state.payload);
                        if ('isSuccess' in response.data)
                        {
                            await apiActionAsync(response)
                        }
                    }
                    return `${isRender.action} completed successfully`
                },
                error: async (error) =>
                {
                    if (error instanceof AxiosError && error.response)
                    {
                        if ('isSuccess' in error.response.data)
                        {
                            await apiActionAsync(error.response)
                        }
                    }

                    return `Failed to ${isRender.action}`
                },
                className: "capitalize"
            }
        )
    }, [isRender, state])

    useEffect(() =>
    {
        const payload: FetchPagedResultPayload = {
            ...state.payload,
            sorting,
            columnFilters,
            pageNumber: pagination.pageIndex,
            pageSize: pagination.pageSize
        }
        fetchPagedResultAsync(payload)
    }, [sorting, columnFilters, pagination])

    useEffect(() =>
    {
        dispatch({ type: DataGridActionEnum.SET_INITIAL_STATE, payload: { path, viewId } })
        fetchDataGridConfigurationAsync(viewId)
    }, [viewId])

    const contextValue: DataGridContextValue = useMemo(() =>
    ({
        ...state,
        loading,
        isRender,
        setRender,
        dataGridDef,
        fetchDataGridConfigurationAsync,
        fetchPagedResultAsync,
        handleSubmitAsync,
        defaultValue
    }), [dataGridDef, sorting, columnFilters, columnPinning, columnSizing, rowSelection, state, loading, isRender, viewId, handleSubmitAsync])

    return (
        <DataGridContextProvider.Provider value={contextValue}>
            <div className='h-fit w-full grid grid-cols-1 p-2.5 gap-2.5'>
                {children}
            </div>
        </DataGridContextProvider.Provider>
    )
}

export default DataGridProvider
