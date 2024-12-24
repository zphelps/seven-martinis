import { Ingredient, UpdateIngredientProps } from "../hooks/use-recipe"
import { ChangeQuantityInput } from "./change-quantity-input"
import { ChangeUnitSelect } from "./change-unit-select"
import { ChangeInventoryItemComboBox } from "./change-inventory-item-combobox"
import { InventoryItem } from "@/features/inventory/components/columns"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface IngredientCardProps {
    ingredient: Ingredient
    inventory: InventoryItem[]
    updateIngredient: (id: string, item: UpdateIngredientProps) => Promise<void>
    deleteIngredient: (id: string) => Promise<void>
}

export const IngredientCard = ({ ingredient, inventory, updateIngredient, deleteIngredient }: IngredientCardProps) => {
    return (
        <div key={ingredient.id}>
            <div className="flex items-center gap-2">
                <ChangeQuantityInput
                    ingredient_id={ingredient.id}
                    quantity={ingredient.quantity}
                    updateIngredient={updateIngredient}
                />
                <ChangeUnitSelect
                    ingredient_id={ingredient.id}
                    unit={ingredient.unit}
                    updateIngredient={updateIngredient}
                />
                <ChangeInventoryItemComboBox
                    ingredient_id={ingredient.id}
                    inventory={inventory}
                    inventory_item={ingredient.inventory_item}
                    updateIngredient={updateIngredient}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 bg-gray-50 border-0 h-8 w-8 min-w-8 text-gray-500"
                    onClick={async () => {
                        await deleteIngredient(ingredient.id)
                    }}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}