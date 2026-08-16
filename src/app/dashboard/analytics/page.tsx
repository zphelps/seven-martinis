"use client"

import { useMemo, useState } from "react"
import { endOfDay, startOfDay, subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useMenu from "@/features/menu/hooks/use-menu"
import useTags from "@/features/tags/hooks/use-tags"
import useEvents from "@/features/invitations/hooks/use-events"
import { useOrderAnalytics } from "@/features/analytics/hooks/use-order-analytics"
import {
    Availability,
    computeDrinkStats,
    computeSummary,
    computeTagStats,
    computeTimeSeries,
    filterMenuItems,
    filterOrdersByDate,
} from "@/features/analytics/lib/compute-stats"
import { AnalyticsToolbar } from "@/features/analytics/components/analytics-toolbar"
import { DatePreset } from "@/features/analytics/components/date-range-filter"
import { StatTiles } from "@/features/analytics/components/stat-tiles"
import { TopDrinksChart } from "@/features/analytics/components/top-drinks-chart"
import { OrdersTrendChart } from "@/features/analytics/components/orders-trend-chart"
import { TagBreakdownChart } from "@/features/analytics/components/tag-breakdown-chart"
import { RatingDistributionChart } from "@/features/analytics/components/rating-distribution-chart"
import { DrinksTable } from "@/features/analytics/components/drinks-table"

function getDateRange(preset: DatePreset, customRange: DateRange | undefined): { from: Date | null; to: Date | null } {
    const now = new Date()

    switch (preset) {
        case "today":
            return { from: startOfDay(now), to: endOfDay(now) }
        case "7d":
            return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) }
        case "30d":
            return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) }
        case "custom":
            if (!customRange?.from) return { from: null, to: null }
            return {
                from: startOfDay(customRange.from),
                to: endOfDay(customRange.to ?? customRange.from),
            }
        case "all":
        default:
            return { from: null, to: null }
    }
}

function parseEventDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
}

export default function AnalyticsPage() {
    const { orders, loading: ordersLoading, error: ordersError } = useOrderAnalytics()
    const { menuItems, loading: menuLoading } = useMenu({ onlyAvailable: false })
    const { tags } = useTags()
    const { events } = useEvents()

    const [search, setSearch] = useState("")
    const [availability, setAvailability] = useState<Availability>("all")
    const [tagIds, setTagIds] = useState<string[]>([])
    const [datePreset, setDatePreset] = useState<DatePreset>("all")
    const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined)
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

    const activeTags = useMemo(() => tags.filter((tag) => tag.is_active), [tags])
    const selectedEvent = useMemo(
        () => events.find((event) => event.id === selectedEventId && event.event_date) ?? null,
        [events, selectedEventId]
    )

    function handleDatePresetChange(preset: DatePreset) {
        setSelectedEventId(null)
        setDatePreset(preset)
    }

    function handleCustomRangeChange(range: DateRange | undefined) {
        setSelectedEventId(null)
        setCustomRange(range)
    }

    const { from: dateFrom, to: dateTo } = useMemo(() => {
        if (selectedEvent?.event_date) {
            const eventDay = parseEventDate(selectedEvent.event_date)
            // Extend through 3 AM the next day so drinks ordered after
            // midnight are still counted as part of this night.
            const nextDay3am = new Date(eventDay.getFullYear(), eventDay.getMonth(), eventDay.getDate() + 1, 3, 0, 0, 0)
            return { from: startOfDay(eventDay), to: nextDay3am }
        }
        return getDateRange(datePreset, customRange)
    }, [selectedEvent, datePreset, customRange])

    const dateFilteredOrders = useMemo(
        () => filterOrdersByDate(orders, dateFrom, dateTo),
        [orders, dateFrom, dateTo]
    )

    const filteredMenuItems = useMemo(
        () => filterMenuItems(menuItems, { tagIds, availability, search }),
        [menuItems, tagIds, availability, search]
    )

    const drinkStats = useMemo(
        () => computeDrinkStats(dateFilteredOrders, filteredMenuItems),
        [dateFilteredOrders, filteredMenuItems]
    )

    const tagStats = useMemo(() => computeTagStats(drinkStats), [drinkStats])
    const timeSeries = useMemo(
        () => computeTimeSeries(dateFilteredOrders, !!selectedEvent),
        [dateFilteredOrders, selectedEvent]
    )
    const summary = useMemo(() => computeSummary(dateFilteredOrders), [dateFilteredOrders])

    function toggleTag(tagId: string) {
        setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
    }

    if (ordersLoading || menuLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse border border-primary/10">
                    <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Loading analytics...</p>
            </div>
        )
    }

    if (ordersError) return <div className="text-destructive p-4">Error: {ordersError}</div>

    return (
        <div className="w-full h-screen overflow-y-auto p-4 space-y-4 bg-background">
            <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">Analytics</h1>
            </div>

            <StatTiles summary={summary} />

            <Card>
                <AnalyticsToolbar
                    search={search}
                    onSearchChange={setSearch}
                    availability={availability}
                    onAvailabilityChange={setAvailability}
                    tags={activeTags}
                    selectedTagIds={tagIds}
                    onTagToggle={toggleTag}
                    menuItems={menuItems}
                    events={events}
                    selectedEventId={selectedEventId}
                    onEventSelect={setSelectedEventId}
                    datePreset={datePreset}
                    customRange={customRange}
                    onDatePresetChange={handleDatePresetChange}
                    onCustomRangeChange={handleCustomRangeChange}
                />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Most served drinks</CardTitle>
                        <CardDescription>Total quantity served, filtered range</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TopDrinksChart drinks={drinkStats} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Drinks served over time</CardTitle>
                        <CardDescription>
                            {selectedEvent
                                ? `Hourly curve for ${selectedEvent.title}`
                                : "Pacing across the filtered range"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersTrendChart points={timeSeries} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Volume by tag</CardTitle>
                        <CardDescription>Which collections move the most</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TagBreakdownChart tags={tagStats} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Rating distribution</CardTitle>
                        <CardDescription>Star ratings submitted with orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RatingDistributionChart ratingCounts={summary.ratingCounts} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Drinks</CardTitle>
                    <CardDescription>
                        {drinkStats.length} {drinkStats.length === 1 ? "drink" : "drinks"} matching current filters
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <DrinksTable drinks={drinkStats} />
                </CardContent>
            </Card>
        </div>
    )
}
