import { useState, useEffect } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import useInventory from "@/features/inventory/hooks/use-inventory"
import { UpdateIngredientProps } from "../hooks/use-recipe"
import { Command } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { InventoryItem } from "@/features/inventory/components/columns"

interface ChangeInventoryItemComboBoxProps {
    ingredient_id: string
    inventory_item: InventoryItem
    inventory: InventoryItem[]
    updateIngredient: (id: string, item: UpdateIngredientProps) => Promise<void>
}

export function ChangeInventoryItemComboBox({
    ingredient_id,
    inventory_item,
    inventory,
    updateIngredient,
}: ChangeInventoryItemComboBoxProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(inventory_item)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setSelectedItem(inventory_item)
    }, [inventory_item])

    const handleChange = async (value: InventoryItem) => {
        setSelectedItem(value)
        setOpen(false)
        await updateIngredient(ingredient_id, { inventory_item_id: value.id })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-xs h-8 bg-gray-50 hover:bg-gray-100 border-0 rounded-md pl-2 pr-1"
                >
                    {selectedItem
                        ? selectedItem.name
                        : "Select item..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search inventory..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {inventory.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={() => handleChange(item)}
                                >
                                    {item.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedItem?.id === item.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
