"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DrinkStat } from "../lib/compute-stats"
import { CHART_AXIS_TEXT, CHART_GRID, CHART_PRIMARY, CHART_TOOLTIP_BG, CHART_TOOLTIP_BORDER, CHART_TOOLTIP_TEXT } from "../lib/chart-colors"

interface TopDrinksChartProps {
    drinks: DrinkStat[]
    limit?: number
}

function TopDrinksTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const stat: DrinkStat = payload[0].payload

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

export function TopDrinksChart({ drinks, limit = 10 }: TopDrinksChartProps) {
    const data = [...drinks]
        .filter((drink) => drink.totalQuantity > 0)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, limit)

    if (data.length === 0) {
        return <p className="text-sm text-muted-foreground py-8 text-center">No drinks ordered in this range yet.</p>
    }

    const chartHeight = Math.max(data.length * 36, 120)

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
                <CartesianGrid horizontal={false} stroke={CHART_GRID} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }}
                    axisLine={{ stroke: CHART_GRID }}
                    tickLine={false}
                />
                <Tooltip content={<TopDrinksTooltip />} cursor={{ fill: "hsl(var(--secondary))" }} />
                <Bar dataKey="totalQuantity" fill={CHART_PRIMARY} radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
        </ResponsiveContainer>
    )
}
