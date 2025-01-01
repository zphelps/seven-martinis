"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Search } from "lucide-react"
import { MenuItem } from "@/types/order"
import { Label } from "@/components/ui/label"
interface MenuItemsComboboxProps {
    menuItems: any[],
    selectedMenuItem: MenuItem | null,
    setSelectedMenuItem: (menuItem: MenuItem | null) => void
}

export function MenuItemsCombobox({ menuItems, selectedMenuItem, setSelectedMenuItem }: MenuItemsComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start">
                        {selectedMenuItem ? <>{selectedMenuItem.name}</> : <>Search for a drink</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <MenuItemsList
                        menuItems={menuItems}
                        setOpen={setOpen}
                        setSelectedMenuItem={setSelectedMenuItem}
                    />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div>
                    <Label className="text-sm">Drink</Label>
                    <Button variant="outline" className="w-full justify-start shadow-sm border-gray-300">
                        {selectedMenuItem ?
                            <div className="flex space-x-2">
                                <p className="text-sm text-gray-500">#{selectedMenuItem.drink_number}.</p>
                                <p className="text-sm">{selectedMenuItem.name}</p>
                            </div>
                            : (
                                <p className="text-base font-normal text-gray-500">
                                    Select a drink
                                </p>
                            )}
                    </Button>
                </div>
            </DrawerTrigger>
            <DrawerTitle>
            </DrawerTitle>
            <DrawerContent aria-describedby="Select a drink">
                <div className="mt-4 border-t">
                    <MenuItemsList
                        menuItems={menuItems}
                        setOpen={setOpen}
                        setSelectedMenuItem={setSelectedMenuItem}
                    />
                </div>
            </DrawerContent>
        </Drawer >
    )
}

function MenuItemsList({
    menuItems,
    setOpen,
    setSelectedMenuItem,
}: {
    menuItems: any[]
    setOpen: (open: boolean) => void
    setSelectedMenuItem: (menuItem: MenuItem | null) => void
}) {
    return (
        <Command>
            <CommandInput className="text-base placeholder:text-base" placeholder="Search for a drink..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {menuItems.map((item) => (
                        <CommandItem
                            key={item.id}
                            value={`#${item.drink_number} ${item.name}`}
                            onSelect={(value) => {
                                const menuItem = menuItems.find((item) => `#${item.drink_number} ${item.name}` === value);
                                setSelectedMenuItem(
                                    menuItems.find((item) => `#${item.drink_number} ${item.name}` === value) || null
                                )
                                setOpen(false)
                            }}
                        >
                            <div className="flex space-x-2">
                                <p className="text-sm text-gray-500 w-8">#{item.drink_number}</p>
                                <div className="">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>

                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command >
    )
}
