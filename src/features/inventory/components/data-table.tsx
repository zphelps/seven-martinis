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
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSidebar } from "@/components/ui/sidebar"
import { useRouter, useSearchParams } from "next/navigation"
import InventoryItemSidebar from "./inventory-item-sidebar"
import { InventoryItem } from "./columns"
import { InventoryToolbar } from "./inventory-toolbar"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { AddInventoryItemProps } from "../hooks/use-inventory"

interface InventoryDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    addInventoryItem: (item: AddInventoryItemProps) => Promise<InventoryItem>
}

export function InventoryDataTable<TData, TValue>({
    columns,
    data,
    addInventoryItem,
}: InventoryDataTableProps<TData, TValue>) {
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
            <InventoryToolbar table={table} addInventoryItem={addInventoryItem} />
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
                                    const inventoryItem = row.original as InventoryItem
                                    if (id === inventoryItem.id) {
                                        router.push(`/dashboard/inventory`)
                                    } else {
                                        router.push(`/dashboard/inventory?id=${inventoryItem.id}`)
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
        // <div className="rounded-lg border h-full mr-2 shadow">
        //     <InventoryToolbar
        //         addInventoryItem={addInventoryItem}
        //         table={table}
        //     />
        //     <Separator />
        //     <Table>
        //         <TableHeader>
        //             {table.getHeaderGroups().map((headerGroup) => (
        //                 <TableRow key={headerGroup.id}>
        //                     {headerGroup.headers.map((header) => {
        //                         return (
        //                             <TableHead key={header.id}>
        //                                 {header.isPlaceholder
        //                                     ? null
        //                                     : flexRender(
        //                                         header.column.columnDef.header,
        //                                         header.getContext()
        //                                     )}
        //                             </TableHead>
        //                         )
        //                     })}
        //                 </TableRow>
        //             ))}
        //         </TableHeader>
        //         <TableBody>
        //             {table.getRowModel().rows?.length ? (
        //                 table.getRowModel().rows.map((row) => (
        //                     <TableRow
        //                         key={row.id}
        //                         className="cursor-pointer"
        //                         onClick={() => {
        //                             const inventoryItem = row.original as InventoryItem
        //                             if (id === inventoryItem.id) {
        //                                 router.push(`/dashboard/inventory`)
        //                             } else {
        //                                 router.push(`/dashboard/inventory?id=${inventoryItem.id}`)
        //                             }
        //                         }}
        //                         data-state={row.getIsSelected() && "selected"}
        //                     >
        //                         {row.getVisibleCells().map((cell) => (
        //                             <TableCell key={cell.id} className="px-4 py-2">
        //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                             </TableCell>
        //                         ))}
        //                     </TableRow>
        //                 ))
        //             ) : (
        //                 <TableRow>
        //                     <TableCell colSpan={columns.length} className="h-24 text-center">
        //                         No results.
        //                     </TableCell>
        //                 </TableRow>
        //             )}
        //         </TableBody>
        //     </Table>
        // </div>
    )
}
