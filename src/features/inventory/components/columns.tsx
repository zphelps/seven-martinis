"use client"

import { ColumnDef } from "@tanstack/react-table"
import TypeChip from "./type-chip"
import Image from "next/image"
import { CameraIcon } from "@heroicons/react/24/outline"
import { ImageIcon } from "lucide-react"
import { StockChip } from "./stock-chip"
export type InventoryItem = {
    id: string
    name: string
    type: "garnish" | "liquor" | "liqueur" | "bitters" | "juice" | "syrup" | "fruit" | "other"
    stock: string
    image_url: string
}

export const columns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: "image_url",
        header: () => <ImageIcon className="ml-3 w-4 h-4" />,
        cell: ({ row }) => {
            const imageUrl = row.original.image_url
            return (
                <div className="w-10 h-10 rounded-md overflow-hidden bg-white">
                    {imageUrl ? <img src={imageUrl} alt="Inventory Item" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-xs text-center text-gray-500">No Image</p>
                    </div>}
                </div>
            )
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.original.type
            return <TypeChip type={type} />
        }
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.original.stock
            return <StockChip stock={stock} />
        }
    },
]