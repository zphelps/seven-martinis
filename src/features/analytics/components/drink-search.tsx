"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MenuItem } from "@/types/order"

interface DrinkSearchProps {
    menuItems: MenuItem[]
    value: string
    onSelect: (name: string) => void
}

export function DrinkSearch({ menuItems, value, onSelect }: DrinkSearchProps) {
    const [open, setOpen] = useState(false)
    const selected = menuItems.find((item) => item.name === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-56 justify-between font-normal">
                    <span className="flex items-center gap-2 truncate">
                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                        <span className="truncate">
                            {selected ? `#${selected.drink_number} ${selected.name}` : "Search drinks..."}
                        </span>
                    </span>
                    {value && (
                        <X
                            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                            onClick={(event) => {
                                event.stopPropagation()
                                onSelect("")
                            }}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search drinks..." />
                    <CommandList>
                        <CommandEmpty>No drinks found.</CommandEmpty>
                        <CommandGroup>
                            {menuItems.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={`#${item.drink_number} ${item.name}`}
                                    onSelect={() => {
                                        onSelect(item.name)
                                        setOpen(false)
                                    }}
                                >
                                    <span className="text-muted-foreground w-8 shrink-0">#{item.drink_number}</span>
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
