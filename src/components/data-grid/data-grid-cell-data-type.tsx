import { useMemo, type ComponentProps, type ReactElement } from "react";
import type { RowData } from "@/types/common";
import { type Cell } from "@tanstack/react-table";
import { format } from "date-fns";
import type { ColumnMeta } from "@/types/data-grid";
import { CurrencyConvertor } from "@/lib/currency-convertor";
// const formatIST = (value: any): string | null =>
// {
//     if (!value) return null;
//     const ist = new Date(value + 'Z').toLocaleString('en-IN', {
//         timeZone: 'Asia/Kolkata'
//     });
//     return ist
// };

const formatIST = (value: any): string | null =>
{
    if (!value) return null;
    const ist = new Date(value).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata'
    });
    return ist;
};

interface DataGridCellDataTypeProps extends ComponentProps<'span'>
{
    cell: Cell<RowData, unknown>
    meta: ColumnMeta
    renderItem: (value: any) => ReactElement
}

export default function DataGridCellDataType({ cell, meta, renderItem, className, ...props }: DataGridCellDataTypeProps)
{
    const cellValue = cell.renderValue() as any;

    const actualValue = useMemo(() => cellValue && typeof cellValue == "object" && 'label' in cellValue
        ? cellValue.label
        : Array.isArray(cellValue)
            ? cellValue.map(item => typeof item == "object" && 'label' in item
                ? item.label
                : item
            )
            : cellValue,
        [cellValue])

    switch (meta.dataType)
    {
        case "currency":
            return renderItem(<span className="m-auto" {...props}>{CurrencyConvertor(actualValue)}</span>);

        case "array":
            return Array.isArray(actualValue)
                ? <>{actualValue.map((item, index) => (
                    <span key={index}>{renderItem(item)}</span>
                ))}</>
                : renderItem(actualValue);

        case "date":
            return renderItem(<span className='m-auto' {...props}>{actualValue ? formatIST(actualValue) : "-"}</span>);

        case "time":
            return renderItem(<span className='m-auto' {...props}>{actualValue && format(actualValue, "XXXXX")}</span>);

        case "boolean":
            return renderItem(
                actualValue === 1 || actualValue === "true" || actualValue === true
                    ? true
                    : actualValue === 0 || actualValue === "false" || actualValue === false
                        ? false
                        : actualValue
            );

        case "text":
        case "numeric":
        case "file":
            return renderItem(actualValue);

        case "html":
        default:
            return renderItem(<span className="mr-auto" {...props}>{actualValue}</span>);
    }
}