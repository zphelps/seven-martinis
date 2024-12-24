"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation"
import { MenuItem } from "@/types/order"
// import { MenuToolbar } from "./menu-toolbar"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { AddMenuItemProps } from "../hooks/use-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { MenuToolbar } from "./menu-toolbar"

interface MenuDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    addMenuItem: (item: AddMenuItemProps) => Promise<MenuItem>
}

export function MenuDataTable<TData, TValue>({
    columns,
    data,
    addMenuItem,
}: MenuDataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    return (
        <div className="flex flex-col rounded-lg border w-full h-full mr-2 shadow">
            <MenuToolbar table={table} addMenuItem={addMenuItem} />
            <Separator />
            <Table wrapperClassName="overflow-y-auto h-full">
                <TableHeader className="sticky top-0 bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="w-full">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer"
                                onClick={() => {
                                    const menuItem = row.original as MenuItem
                                    if (id === menuItem.id) {
                                        router.push(`/dashboard/menu`)
                                    } else {
                                        router.push(`/dashboard/menu?id=${menuItem.id}`)
                                    }
                                }}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
