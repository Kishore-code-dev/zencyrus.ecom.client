import type { DataType, OptionItem, Variant } from "./common"

export type FilterOptionItem = Record<Variant, OptionItem[]>

export type Logic =
    | "AND"
    | "OR"

export type MatchCase =
    | "="
    | "!="
    | "<>"
    | "<"
    | "<="
    | ">"
    | ">="
    | "IS NULL"
    | "IS NOT NULL"
    | "IS NULL OR ''"
    | "IS NULL OR '[]'"
    | "IS NOT NULL AND ''"
    | "IS NOT NULL AND '[]'"
    | "IN"
    | "NOT IN"
    | "LIKE"
    | "NOT LIKE"
    | "BETWEEN"
    | "None"

export interface Rules
{
    logic: Logic
    value: any
    alias: string
    dataType: DataType
    matchCase: MatchCase;
}

export interface Filter
{
    id: string
    value: Rules
}

