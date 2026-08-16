"use client"

import { useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { CalendarIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type DatePreset = "today" | "7d" | "30d" | "all" | "custom"

const PRESET_LABELS: Record<DatePreset, string> = {
    today: "Today",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    all: "All time",
    custom: "Custom range",
}

const PRESET_OPTIONS: DatePreset[] = ["today", "7d", "30d", "all"]

interface DateRangeFilterProps {
    preset: DatePreset
    customRange: DateRange | undefined
    onPresetChange: (preset: DatePreset) => void
    onCustomRangeChange: (range: DateRange | undefined) => void
}

export function DateRangeFilter({ preset, customRange, onPresetChange, onCustomRangeChange }: DateRangeFilterProps) {
    const [open, setOpen] = useState(false)

    const label =
        preset === "custom" && customRange?.from
            ? customRange.to
                ? `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d")}`
                : format(customRange.from, "MMM d")
            : PRESET_LABELS[preset]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {label}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                    <div className="flex flex-col p-2 w-40">
                        {PRESET_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onPresetChange(option)
                                    setOpen(false)
                                }}
                                className={cn(
                                    "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary text-left",
                                    preset === option && "font-medium"
                                )}
                            >
                                {PRESET_LABELS[option]}
                                {preset === option && <Check className="h-4 w-4" />}
                            </button>
                        ))}
                        <Separator className="my-1" />
                        <p className="px-2 py-1 text-xs text-muted-foreground">Custom range</p>
                    </div>
                    <Separator orientation="vertical" className="h-auto" />
                    <Calendar
                        mode="range"
                        selected={customRange}
                        onSelect={(range) => {
                            onCustomRangeChange(range)
                            onPresetChange("custom")
                        }}
                        numberOfMonths={1}
                        initialFocus
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
