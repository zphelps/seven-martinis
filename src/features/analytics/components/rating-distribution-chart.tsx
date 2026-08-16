"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { CHART_AXIS_TEXT, CHART_GRID, CHART_TOOLTIP_BG, CHART_TOOLTIP_BORDER, CHART_TOOLTIP_TEXT, RATING_ORDINAL_STEPS } from "../lib/chart-colors"

interface RatingDistributionChartProps {
    ratingCounts: [number, number, number, number, number]
}

interface RatingBucket {
    stars: string
    count: number
}

function RatingTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const bucket: RatingBucket = payload[0].payload

    return (
        <div
            className="rounded-md border px-3 py-2 text-sm shadow-md"
            style={{ background: CHART_TOOLTIP_BG, borderColor: CHART_TOOLTIP_BORDER, color: CHART_TOOLTIP_TEXT }}
        >
            <p className="font-medium">{bucket.stars}</p>
            <p className="text-base font-semibold">{bucket.count} orders</p>
        </div>
    )
}

export function RatingDistributionChart({ ratingCounts }: RatingDistributionChartProps) {
    const data: RatingBucket[] = ratingCounts.map((count, index) => ({ stars: `${index + 1}★`, count }))
    const hasResponses = ratingCounts.some((count) => count > 0)

    if (!hasResponses) {
        return <p className="text-sm text-muted-foreground py-8 text-center">No ratings submitted in this range yet.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
                <CartesianGrid vertical={false} stroke={CHART_GRID} />
                <XAxis dataKey="stars" tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={32} />
                <Tooltip content={<RatingTooltip />} cursor={{ fill: "hsl(var(--secondary))" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {data.map((entry, index) => (
                        <Cell key={entry.stars} fill={RATING_ORDINAL_STEPS[index]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
