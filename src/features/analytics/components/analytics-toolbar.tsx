"use client"

import { DateRange } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Event } from "@/types/invitation"
import { MenuItem, Tag } from "@/types/order"
import { Availability } from "../lib/compute-stats"
import { DatePreset, DateRangeFilter } from "./date-range-filter"
import { DrinkSearch } from "./drink-search"
import { EventFilter } from "./event-filter"
import { TagFilter } from "./tag-filter"

interface AnalyticsToolbarProps {
    search: string
    onSearchChange: (value: string) => void
    availability: Availability
    onAvailabilityChange: (value: Availability) => void
    tags: Tag[]
    selectedTagIds: string[]
    onTagToggle: (tagId: string) => void
    menuItems: MenuItem[]
    events: Event[]
    selectedEventId: string | null
    onEventSelect: (eventId: string | null) => void
    datePreset: DatePreset
    customRange: DateRange | undefined
    onDatePresetChange: (preset: DatePreset) => void
    onCustomRangeChange: (range: DateRange | undefined) => void
}

export function AnalyticsToolbar({
    search,
    onSearchChange,
    availability,
    onAvailabilityChange,
    tags,
    selectedTagIds,
    onTagToggle,
    menuItems,
    events,
    selectedEventId,
    onEventSelect,
    datePreset,
    customRange,
    onDatePresetChange,
    onCustomRangeChange,
}: AnalyticsToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 p-2">
            <DateRangeFilter
                preset={datePreset}
                customRange={customRange}
                onPresetChange={onDatePresetChange}
                onCustomRangeChange={onCustomRangeChange}
            />

            <EventFilter events={events} selectedEventId={selectedEventId} onSelect={onEventSelect} />

            <TagFilter tags={tags} selectedTagIds={selectedTagIds} onToggle={onTagToggle} />

            <Select value={availability} onValueChange={(value) => onAvailabilityChange(value as Availability)}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All drinks</SelectItem>
                    <SelectItem value="available">Available only</SelectItem>
                    <SelectItem value="unavailable">Unavailable only</SelectItem>
                </SelectContent>
            </Select>

            <DrinkSearch menuItems={menuItems} value={search} onSelect={onSearchChange} />
        </div>
    )
}
