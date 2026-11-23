import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/config/api'
import { PagedResultReducer, initialValue } from '@/config/paged-result'
import { useApiAction } from '@/hooks/use-api-action'
import type { RowData } from '@/types/common'
import { PagedResultActionEnum, type PagedResultContextValue, type PagedResultProviderProps, type PagedResultRender, type PagedResultPayload } from '@/types/paged-result'
import { type ColumnFiltersState, type ColumnSizingState, type RowSelectionState, type SortingState, type ColumnPinningState, type PaginationState, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useMemo, useReducer, useState, useTransition } from 'react'

export const PagedResultContextProvider = createContext<PagedResultContextValue | null>(null)

export const tableRowSelectionCheckboxCell: ColumnDef<RowData> = {
    id: "id",
    accessorKey: 'id',
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected())
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

function PagedResultProvider({
    path = "",
    viewId = "",
    defaultFilters = [],
    defaultSorting = [],
    defaultColumns = [],
    defaultColumnPinning = { left: [], right: [] },
    defaultValue,
    children,
    pageSize = 10
}: PagedResultProviderProps)
{
    const [state, dispatch] = useReducer(PagedResultReducer, initialValue)
    const [sorting, setSorting] = useState<SortingState>([...defaultSorting])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([...defaultFilters])
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ['id', ...defaultColumnPinning.left as string[]],
        right: [...defaultColumnPinning.right as string[]]
    })
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pagination, setPagination] = useState<PaginationState>({ pageSize, pageIndex: 1 })
    const [loading, startTransition] = useTransition()
    const [isRender, setRender] = useState<PagedResultRender>({
        id: "",
        open: false,
        action: 'none'
    })
    const pagedResultDef = useReactTable<RowData>({
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

    const fetchPagedResultAsync = useCallback(async (payload: PagedResultPayload) =>
    {
        startTransition(async () =>
        {
            try
            {
                const pageNumber = payload.pageNumber == 0 ? 1 : payload.pageNumber
                const response = await api.post(`${path}/pagedresult?pageSize=${payload.pageSize}&pageNumber=${pageNumber}&searchString=${payload.searchString}&viewId=${payload.viewId}`, payload);
                if (response.status == 200 && response.data)
                {
                    dispatch({ type: PagedResultActionEnum.UPDATE_PAGED_RESULT, payload: response.data });
                    dispatch({ type: PagedResultActionEnum.UPDATE_PAGED_RESULT_PAYLOAD, payload })
                    setColumnFilters(payload.columnFilters)
                    setSorting(payload.sorting)
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

    const fetchPagedResultConfigurationAsync = useCallback(async (viewId: string) =>
    {
        startTransition(async () =>
        {
            try
            {
                const response = await api.get(`corefuncationality/views/config?viewId=${viewId}`)
                if (response.status == 200 && response.data)
                {
                    dispatch({ type: PagedResultActionEnum.UPDATE_DATA_GRID_CONFIGURATION, payload: response.data })
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
        })
    }, [state.pagedResult, columnFilters, sorting])

    useEffect(() =>
    {
        const payload: PagedResultPayload = {
            ...state.payload,
            sorting,
            columnFilters,
            pageNumber: pagination.pageIndex,
            pageSize: pagination.pageSize
        }
        fetchPagedResultAsync(payload)
    }, [pagination])

    useEffect(() =>
    {
        if (!viewId) return
        dispatch({ type: PagedResultActionEnum.SET_INITIAL_STATE, payload: { path, viewId } })
        fetchPagedResultConfigurationAsync(viewId)
    }, [viewId])

    const contextValue: PagedResultContextValue = useMemo(() =>
    ({
        ...state,
        loading,
        isRender,
        setRender,
        pagedResultDef,
        fetchPagedResultConfigurationAsync,
        fetchPagedResultAsync,
        defaultValue
    }), [pagedResultDef, sorting, columnFilters, columnPinning, columnSizing, rowSelection, state, loading, isRender, viewId])

    return (
        <PagedResultContextProvider.Provider value={contextValue}>
            {children}
        </PagedResultContextProvider.Provider>
    )
}

export default PagedResultProvider
