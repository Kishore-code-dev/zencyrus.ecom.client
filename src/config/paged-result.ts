import { tableRowSelectionCheckboxCell } from "@/providers/paged-result-provider";
import { PagedResultActionEnum, type Column, type PagedResultDispatch, type PagedResultState } from "@/types/paged-result";

export const initialValue: PagedResultState = {
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
    mode: "DIALOG_FORM_DATA_GRID",
    title: "",
    description: "",
    submissionUrl: "",
    permissions: ["CREATE", "UPDATE", "DELETE", "VIEW_SINGLE_ROW", "EXPORT_DATA", "VIEW_SELECT"],
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
    objectId: ""
}

export const PagedResultReducer = (state: PagedResultState, action: PagedResultDispatch) =>
{
    switch (action.type)
    {
        case PagedResultActionEnum.ADD_ROWS:
            {
                const newState: PagedResultState = {
                    ...state,
                    pagedResult: {
                        ...state.pagedResult,
                        items: [...state.pagedResult.items, action.payload]
                    }
                }
                return newState
            }
        case PagedResultActionEnum.DELETE_ROWS:
            {
                const newState: PagedResultState = {
                    ...state,
                    pagedResult: {
                        ...state.pagedResult,
                        items: [...state.pagedResult.items].filter(item => !action.payload.includes(item.id))
                    }
                }
                return newState
            }
        case PagedResultActionEnum.UPDATE_CELL:
            {
                const newState: PagedResultState = {
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
        case PagedResultActionEnum.UPDATE_PAGED_RESULT:
            {
                const newState: PagedResultState = {
                    ...state,
                    pagedResult: action.payload
                }
                return newState
            }
        case PagedResultActionEnum.UPDATE_PAGED_RESULT_PAYLOAD:
            {
                const newState: PagedResultState = {
                    ...state,
                    payload: action.payload
                }
                return newState
            }
        case PagedResultActionEnum.UPDATE_DATA_GRID_CONFIGURATION:
            {
                const newState: PagedResultState = {
                    ...state,
                    ...action.payload,
                    columns: [tableRowSelectionCheckboxCell as Column, ...action.payload.columns]
                }
                return newState
            }
        case PagedResultActionEnum.SET_INITIAL_STATE:
            {
                const newState: PagedResultState = {
                    ...state,
                    ...action.payload,
                }
                return newState
            }
        default:
            return state
    }
}