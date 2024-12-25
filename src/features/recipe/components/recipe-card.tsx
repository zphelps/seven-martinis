import { InventoryItem } from "@/features/inventory/components/columns"
import { AddIngredientProps, Recipe, UpdateIngredientProps, UpdateRecipeProps } from "../hooks/use-recipe"
import { IngredientCard } from "./ingredient-card"
import { Ingredient } from "../hooks/use-recipe"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

interface RecipeSectionProps {
    recipe: Recipe
    inventory: InventoryItem[]
    updateIngredient: (id: string, item: UpdateIngredientProps) => Promise<void>
    addIngredient: (ingredient: AddIngredientProps) => Promise<void>
    deleteIngredient: (id: string) => Promise<void>
}

export default function RecipeSection({
    recipe,
    inventory,
    updateIngredient,
    addIngredient,
    deleteIngredient,
}: RecipeSectionProps) {

    const handleAddIngredient = async () => {
        const newIngredient = {
            id: uuidv4(),
            menu_item_id: recipe.menu_item_id,
            inventory_item_id: inventory[0].id,
            quantity: 1,
            unit: "oz",
            note: "",
        }
        await addIngredient(newIngredient)
    }

    return (
        <div className="space-y-2 px-3">
            <p className="text-md font-bold">
                Recipe
            </p>
            {recipe.ingredients.map((ingredient: Ingredient) => (
                <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    inventory={inventory}
                    updateIngredient={updateIngredient}
                    deleteIngredient={deleteIngredient}
                />
            ))}
            <Button
                onClick={handleAddIngredient}
                className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-black h-7 font-normal"
            >
                <PlusIcon className="w-1 h-1 text-gray-500" />
            </Button>
        </div>
    )
}