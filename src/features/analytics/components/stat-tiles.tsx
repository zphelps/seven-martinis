"use client"

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AnalyticsSummary } from "../lib/compute-stats"
import { GlassWater, ListChecks, Star, Users } from "lucide-react"

interface StatTilesProps {
    summary: AnalyticsSummary
}

function formatCompact(value: number): string {
    return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

function StatTile({
    label,
    value,
    icon,
    caption,
}: {
    label: string
    value: string
    icon: ReactNode
    caption?: ReactNode
}) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="text-muted-foreground">{icon}</div>
                </div>
                <p className="text-2xl font-semibold">{value}</p>
                {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
            </CardContent>
        </Card>
    )
}

export function StatTiles({ summary }: StatTilesProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile
                label="Drinks served"
                value={formatCompact(summary.totalItemsServed)}
                icon={<GlassWater className="w-4 h-4" />}
            />
            <StatTile
                label="Total orders"
                value={formatCompact(summary.totalOrders)}
                icon={<ListChecks className="w-4 h-4" />}
            />
            <StatTile
                label="Unique guests"
                value={formatCompact(summary.uniqueGuests)}
                icon={<Users className="w-4 h-4" />}
            />
            <StatTile
                label="Avg rating"
                value={summary.avgRating ? summary.avgRating.toFixed(1) : "—"}
                icon={<Star className="w-4 h-4" />}
                caption={`${summary.ratingResponses} responses`}
            />
        </div>
    )
}
