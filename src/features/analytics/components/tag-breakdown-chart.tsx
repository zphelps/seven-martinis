"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TagStat } from "../lib/compute-stats"
import { CHART_AXIS_TEXT, CHART_GRID, CHART_PRIMARY, CHART_TOOLTIP_BG, CHART_TOOLTIP_BORDER, CHART_TOOLTIP_TEXT } from "../lib/chart-colors"

interface TagBreakdownChartProps {
    tags: TagStat[]
}

function TagTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const stat: TagStat = payload[0].payload

    return (
        <div
            className="rounded-md border px-3 py-2 text-sm shadow-md"
            style={{ background: CHART_TOOLTIP_BG, borderColor: CHART_TOOLTIP_BORDER, color: CHART_TOOLTIP_TEXT }}
        >
            <p className="font-medium">{stat.name}</p>
            <p className="text-base font-semibold">{stat.totalQuantity} served</p>
        </div>
    )
}

export function TagBreakdownChart({ tags }: TagBreakdownChartProps) {
    if (tags.length === 0) {
        return <p className="text-sm text-muted-foreground py-8 text-center">No tagged drinks ordered in this range yet.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tags} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
                <CartesianGrid vertical={false} stroke={CHART_GRID} />
                <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={32} />
                <Tooltip content={<TagTooltip />} cursor={{ fill: "hsl(var(--secondary))" }} />
                <Bar dataKey="totalQuantity" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}
