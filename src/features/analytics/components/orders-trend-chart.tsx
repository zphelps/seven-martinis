"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TimeSeriesPoint } from "../lib/compute-stats"
import { CHART_AXIS_TEXT, CHART_GRID, CHART_PRIMARY, CHART_TOOLTIP_BG, CHART_TOOLTIP_BORDER, CHART_TOOLTIP_TEXT } from "../lib/chart-colors"

interface OrdersTrendChartProps {
    points: TimeSeriesPoint[]
}

function TrendTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const point: TimeSeriesPoint = payload[0].payload

    return (
        <div
            className="rounded-md border px-3 py-2 text-sm shadow-md"
            style={{ background: CHART_TOOLTIP_BG, borderColor: CHART_TOOLTIP_BORDER, color: CHART_TOOLTIP_TEXT }}
        >
            <p className="font-medium">{point.label}</p>
            <p className="text-base font-semibold">{point.items} drinks served</p>
            <p className="text-muted-foreground">{point.orders} orders</p>
        </div>
    )
}

export function OrdersTrendChart({ points }: OrdersTrendChartProps) {
    if (points.length === 0) {
        return <p className="text-sm text-muted-foreground py-8 text-center">No orders in this range yet.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={points} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
                <defs>
                    <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.1} />
                        <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={CHART_GRID} />
                <XAxis dataKey="label" tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={32} />
                <Tooltip content={<TrendTooltip />} cursor={{ stroke: CHART_GRID }} />
                <Area type="monotone" dataKey="items" stroke={CHART_PRIMARY} strokeWidth={2} fill="url(#trend-fill)" dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
        </ResponsiveContainer>
    )
}
