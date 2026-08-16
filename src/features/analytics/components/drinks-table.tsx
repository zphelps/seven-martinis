"use client"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DrinkStat } from "../lib/compute-stats"

interface DrinksTableProps {
    drinks: DrinkStat[]
}

type SortableKey = "totalQuantity" | "avgRating" | "lastOrderedAt"
type SortDirection = "asc" | "desc"

interface SortState {
    key: SortableKey
    direction: SortDirection
}

const COLUMNS: { key: SortableKey; label: string; className?: string }[] = [
    { key: "totalQuantity", label: "Ordered", className: "text-right" },
    { key: "avgRating", label: "Avg rating", className: "text-right" },
    { key: "lastOrderedAt", label: "Last ordered" },
]

function compareNullable(a: number | null, b: number | null, direction: SortDirection): number {
    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1
    return direction === "asc" ? a - b : b - a
}

export function DrinksTable({ drinks }: DrinksTableProps) {
    const [sort, setSort] = useState<SortState>({ key: "totalQuantity", direction: "desc" })

    const sortedDrinks = useMemo(() => {
        const withSortValue = (drink: DrinkStat): number | null => {
            if (sort.key === "lastOrderedAt") {
                return drink.lastOrderedAt ? new Date(drink.lastOrderedAt).getTime() : null
            }
            return drink[sort.key]
        }

        return [...drinks].sort((a, b) => compareNullable(withSortValue(a), withSortValue(b), sort.direction))
    }, [drinks, sort])

    function toggleSort(key: SortableKey) {
        setSort((prev) =>
            prev.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "desc" }
        )
    }

    function SortIcon({ column }: { column: SortableKey }) {
        if (sort.key !== column) return <ArrowUpDown className="w-3 h-3 opacity-40" />
        return sort.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
    }

    return (
        <Table wrapperClassName="max-h-[480px] overflow-y-auto">
            <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                    <TableHead className="w-14">Rank</TableHead>
                    <TableHead>Drink</TableHead>
                    <TableHead>Tags</TableHead>
                    {COLUMNS.map((column) => (
                        <TableHead key={column.key} className={column.className}>
                            <button
                                onClick={() => toggleSort(column.key)}
                                className={cn(
                                    "inline-flex items-center gap-1 hover:text-foreground",
                                    sort.key === column.key && "text-foreground font-semibold"
                                )}
                            >
                                {column.label}
                                <SortIcon column={column.key} />
                            </button>
                        </TableHead>
                    ))}
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedDrinks.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No drinks match these filters.
                        </TableCell>
                    </TableRow>
                ) : (
                    sortedDrinks.map((drink, index) => (
                        <TableRow key={drink.menuItemId}>
                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                            <TableCell className="font-medium">
                                <span className="text-muted-foreground mr-1.5">#{drink.drinkNumber}</span>
                                {drink.name}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {drink.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary" className="font-normal">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{drink.totalQuantity}</TableCell>
                            <TableCell className="text-right tabular-nums">
                                {drink.avgRating ? `${drink.avgRating.toFixed(1)} ★` : "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {drink.lastOrderedAt
                                    ? formatDistanceToNow(new Date(drink.lastOrderedAt), { addSuffix: true })
                                    : "Never"}
                            </TableCell>
                            <TableCell>
                                {drink.available ? (
                                    <Badge variant="outline">Available</Badge>
                                ) : (
                                    <Badge variant="secondary">Unavailable</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
