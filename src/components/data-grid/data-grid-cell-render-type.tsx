import { cn } from "@/lib/utils";
import type { RowData } from "@/types/common";
import type { ColumnMeta } from "@/types/data-grid";
import { flexRender, type Cell } from "@tanstack/react-table";
import type { ComponentProps } from "react";
import DataGridCellDataType from "./data-grid-cell-data-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicIcon } from "lucide-react/dynamic"
import { Link } from "react-router";
import { Download, Eye, LinkIcon } from "lucide-react";
import { Button } from "../ui/button";

interface DataGridCellRenderTypeProps extends ComponentProps<'div'>
{
    cell: Cell<RowData, unknown>
}

export default function DataGridCellRenderType({ cell, className, ...props }: DataGridCellRenderTypeProps)
{
    const meta = cell.column.columnDef.meta as ColumnMeta

    switch (meta.renderType)
    {
        case "avatar":
            {
                return (
                    <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                        <DataGridCellDataType
                            cell={cell}
                            meta={meta}
                            renderItem={(value) => (
                                <Avatar className="size-8 m-auto">
                                    <AvatarImage src={value} />
                                    <AvatarFallback />
                                </Avatar>
                            )}
                        />
                    </div>
                )
            }
        case "image": {
            return (
                <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                    <DataGridCellDataType
                        cell={cell}
                        meta={meta}
                        renderItem={(value) => (
                            <div className="size-20 rounded-md m-auto">
                                <img
                                    loading="lazy"
                                    decoding="async" src={value} alt="IMG" className="bg-cover" />
                            </div>
                        )}
                    />
                </div>
            )
        }
        case "badge":
            {
                return (
                    <div className={cn('h-full w-full flex flex-wrap gap-1.5 overflow-hidden', className)} {...props}>
                        <DataGridCellDataType
                            cell={cell}
                            meta={meta}
                            renderItem={(value) =>
                            {
                                return (
                                    <Badge variant='secondary' className="h-6 w-fit rounded-md m-auto">{value}</Badge>
                                )
                            }}
                        />
                    </div>
                )
            }
        case "progressbar": {
            return (
                <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                    <DataGridCellDataType
                        cell={cell}
                        meta={meta}
                        renderItem={(value) => (
                            <Progress className="m-auto" value={value} />
                        )}
                    />
                </div>
            )
        }
        case "boolean":
            return (
                <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                    <DataGridCellDataType
                        cell={cell}
                        meta={meta}
                        renderItem={(value) => (
                            <Checkbox className="m-auto" checked={value} />
                        )}
                    />
                </div>
            )
        case "icon":
            {
                return (
                    <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                        <DataGridCellDataType
                            cell={cell}
                            meta={meta}
                            renderItem={(value) => (
                                <DynamicIcon className="m-auto size-5 text-muted-foreground" name={value} />
                            )}
                        />
                    </div>
                )
            }
        case "chart":
            {
                return (
                    <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                        {/**
                         * Need to implement 
                         */}
                    </div>
                )
            }
        case "file":
            {
                return (
                    <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                        <DataGridCellDataType
                            cell={cell}
                            meta={meta}
                            renderItem={(value) =>
                            {
                                return (
                                    <div className="flex flex-row items-center justify-center">
                                        <Button size='icon-sm' variant='ghost'>
                                            <Eye />
                                        </Button>
                                        <a href={value} download>
                                            <Button size='icon-sm' variant='ghost'>
                                                <Download />
                                            </Button>
                                        </a>
                                    </div>
                                )
                            }}
                        />
                    </div>
                )
            }
        case "link":
            {
                return (
                    <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                        <DataGridCellDataType
                            cell={cell}
                            meta={meta}
                            renderItem={(value) =>
                            {
                                return (
                                    <Link to={value} className="flex flex-row items-center gap-1 hover:underline m-auto"><LinkIcon className="size-4" /> {value}</Link>
                                )
                            }}
                        />
                    </div>
                )
            }
        case "navigation": {
            return (
                <div className={cn('h-full w-full grid overflow-hidden', className)} {...props}>
                    <DataGridCellDataType
                        cell={cell}
                        meta={meta}
                        renderItem={(value) =>
                        {
                            const path = [meta.baseUrl, meta.path, cell.row.id].filter(Boolean).join("/")
                            return (
                                <Link to={path} className="flex flex-row items-center gap-1 hover:underline m-auto"><LinkIcon className="size-4" /> {value}</Link>
                            )
                        }}
                    />
                </div>
            )
        }
        case "html":
        case "text":
        case "date":
        case "time":
            {
                return (
                    <div className={cn('h-fit w-full text-wrap wrap-anywhere overflow-hidden', className)} {...props}>
                        <DataGridCellDataType
                            cell={cell}
                            meta={meta}
                            renderItem={(value) => (value)}
                        />
                    </div>
                )
            }
        default:
            {
                return (
                    <div className={cn('h-full w-full grid place-content-center place-items-center overflow-hidden m-auto', className)} {...props}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                        )}
                    </div>
                )
            }
    }
}
