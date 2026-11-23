import { tableRowSelectionCheckboxCell } from "@/providers/data-grid-provider";
import { DataGridActionEnum, type Column, type DataGridDispatch, type DataGridState } from "@/types/data-grid";

export const initialValue: DataGridState = {
    path: "",
    viewId: "",
    payload: {
        viewId: "",
        sorting: [],
        columnFilters: [],
        searchString: "",
        pageNumber: 1,
        pageSize: 10
    },
    mode: "INLINE_DATA_GRID",
    title: "",
    description: "",
    submissionUrl: "",
    permissions: [],
    pagedResult: {
        items: [],
        totalItems: 0,
        maxNavigationPages: 0,
        pageNumber: 0,
        pageSize: 10,
        totalPages: 0,
        startPage: 0,
        endPage: 0,
        pageNumbers: []
    },
    columns: [],
    objectId: "",
    isNeedCheckbox: false,
    placeholder: "Search"
}

export const dataGridReducer = (state: DataGridState, action: DataGridDispatch) =>
{
    switch (action.type)
    {
        case DataGridActionEnum.ADD_ROWS:
            {
                const newState: DataGridState = {
                    ...state,
                    pagedResult: {
                        ...state.pagedResult,
                        items: [...state.pagedResult.items, action.payload]
                    }
                }
                return newState
            }
        case DataGridActionEnum.DELETE_ROWS:
            {
                const newState: DataGridState = {
                    ...state,
                    pagedResult: {
                        ...state.pagedResult,
                        items: [...state.pagedResult.items].filter(item => !action.payload.includes(item.id))
                    }
                }
                return newState
            }
        case DataGridActionEnum.UPDATE_CELL:
            {
                const newState: DataGridState = {
                    ...state,
                    pagedResult: {
                        ...state.pagedResult,
                        items: [...state.pagedResult.items].map(item => item.id == action.payload.rowId
                            ? ({
                                ...item,
                                [action.payload.columnName]: action.payload.columnValue
                            })
                            : item
                        )
                    }
                }
                return newState
            }
        case DataGridActionEnum.UPDATE_PAGED_RESULT:
            {
                const newState: DataGridState = {
                    ...state,
                    pagedResult: action.payload
                }
                return newState
            }
        case DataGridActionEnum.UPDATE_PAGED_RESULT_PAYLOAD:
            {
                const newState: DataGridState = {
                    ...state,
                    payload: action.payload
                }
                return newState
            }
        case DataGridActionEnum.UPDATE_DATA_GRID_CONFIGURATION:
            {
                const newState: DataGridState = {
                    ...state,
                    ...action.payload,
                    columns: action.payload.isNeedCheckbox ? [tableRowSelectionCheckboxCell as Column, ...action.payload.columns] : [...action.payload.columns]
                }
                return newState
            }
        case DataGridActionEnum.SET_INITIAL_STATE:
            {
                const newState: DataGridState = {
                    ...state,
                    ...action.payload,
                }
                return newState
            }
        default:
            return state
    }
}