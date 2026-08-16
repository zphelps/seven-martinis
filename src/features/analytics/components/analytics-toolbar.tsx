"use client"

import { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tag } from "@/types/order"
import { Availability, SortKey } from "../lib/compute-stats"
import { DatePreset, DateRangeFilter } from "./date-range-filter"
import { TagFilter } from "./tag-filter"

const SORT_LABELS: Record<SortKey, string> = {
    "most-ordered": "Most ordered",
    "least-ordered": "Least ordered",
    "highest-rated": "Highest rated",
    "lowest-rated": "Lowest rated",
    alphabetical: "Alphabetical",
    "recently-ordered": "Recently ordered",
}

interface AnalyticsToolbarProps {
    search: string
    onSearchChange: (value: string) => void
    availability: Availability
    onAvailabilityChange: (value: Availability) => void
    tags: Tag[]
    selectedTagIds: string[]
    onTagToggle: (tagId: string) => void
    sortKey: SortKey
    onSortChange: (value: SortKey) => void
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
    sortKey,
    onSortChange,
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

            <Input
                placeholder="Search drinks..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-48"
            />

            <div className="ml-auto">
                <Select value={sortKey} onValueChange={(value) => onSortChange(value as SortKey)}>
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(SORT_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
