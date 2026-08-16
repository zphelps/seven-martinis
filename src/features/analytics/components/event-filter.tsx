"use client"

import { CalendarClock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Event } from "@/types/invitation"
import { cn } from "@/lib/utils"

interface EventFilterProps {
    events: Event[]
    selectedEventId: string | null
    onSelect: (eventId: string | null) => void
}

function formatEventDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export function EventFilter({ events, selectedEventId, onSelect }: EventFilterProps) {
    const nights = events.filter((event) => event.event_date)
    const selected = nights.find((event) => event.id === selectedEventId)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start font-normal max-w-56">
                    <CalendarClock className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{selected ? selected.title : "All nights"}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
                <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                    <button
                        onClick={() => onSelect(null)}
                        className={cn(
                            "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary text-left",
                            !selected && "font-medium"
                        )}
                    >
                        All nights
                        {!selected && <Check className="h-4 w-4" />}
                    </button>

                    {nights.length > 0 && <Separator className="my-1" />}

                    {nights.map((event) => (
                        <button
                            key={event.id}
                            onClick={() => onSelect(event.id)}
                            className={cn(
                                "flex flex-col rounded-md px-2 py-1.5 text-sm hover:bg-secondary text-left",
                                selectedEventId === event.id && "font-medium"
                            )}
                        >
                            <span className="flex items-center justify-between gap-2">
                                <span className="truncate">{event.title}</span>
                                {selectedEventId === event.id && <Check className="h-4 w-4 shrink-0" />}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatEventDate(event.event_date!)}</span>
                        </button>
                    ))}

                    {nights.length === 0 && (
                        <p className="text-sm text-muted-foreground px-2 py-1">No invitation nights yet</p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
