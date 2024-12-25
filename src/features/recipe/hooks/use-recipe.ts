import { InventoryItem } from "@/features/inventory/components/columns"
import { MenuItem } from "@/types/order"
import { useEffect, useState } from "react"

interface UseRecipeProps {
    menu_item_id: string | null
}

export interface Recipe {
    menu_item_id: string
    ingredients: Ingredient[]
}

export interface Ingredient {
    id: string
    inventory_item: InventoryItem
    quantity: number
    unit: string
    note: string
}

export interface AddIngredientProps {
    menu_item_id: string
    inventory_item_id: string
    quantity: number
    unit: string
    note: string
}

export interface UpdateIngredientProps {
    quantity?: number
    unit?: string
    note?: string
    inventory_item_id?: string
}

export interface UpdateRecipeProps {
    instructions?: string
}

export const useRecipe = ({ menu_item_id }: UseRecipeProps) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [recipe, setRecipe] = useState<Recipe | null>(null)

    const getMenuItem = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/recipe/${menu_item_id}`)

            if (!response.ok) {
                throw new Error("Failed to fetch menu item")
            }

            const data = await response.json()

            setRecipe(data.data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching menu item:", error)
            setError("Failed to fetch menu item")
            setLoading(false)
        }
    }

    const addIngredient = async (ingredient: AddIngredientProps) => {
        try {
            setLoading(true)
            const prevRecipe = recipe

            // Optimistically update
            setRecipe(prevRecipe =>
                prevRecipe
                    ? { ...prevRecipe, ingredients: [...prevRecipe.ingredients, ingredient] } as Recipe
                    : null
            )

            // Call API
            const response = await fetch(`/api/recipe/${menu_item_id}`, {
                method: "POST",
                body: JSON.stringify(ingredient),
            })

            if (!response.ok) {
                throw new Error("Failed to add ingredient")
            }

            const data = await response.json()

            // Final update with API response
            setRecipe(prevRecipe =>
                prevRecipe
                    ? {
                        ...prevRecipe,
                        ingredients: [...prevRecipe.ingredients.slice(0, -1), data.data],
                    }
                    : null
            )

            setLoading(false)
        } catch (error) {
            // Revert on error
            console.error("Error adding ingredient:", error)
            setError("Failed to add ingredient")
            setLoading(false)
        }
    }

    const deleteIngredient = async (ingredient_id: string) => {
        try {
            setLoading(true)

            const prevRecipe = recipe

            setRecipe(prevRecipe => {
                const updatedRecipe = { ...prevRecipe, ingredients: prevRecipe?.ingredients.filter(ingredient => ingredient.id !== ingredient_id) }
                return updatedRecipe as Recipe
            })

            const response = await fetch(`/api/recipe/${menu_item_id}/${ingredient_id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                setRecipe(prevRecipe)
                throw new Error("Failed to delete ingredient")
            }

            setLoading(false)
        } catch (error) {
            console.error("Error deleting ingredient:", error)
            setError("Failed to delete ingredient")
            setLoading(false)
        }
    }

    const updateIngredient = async (ingredient_id: string, item: UpdateIngredientProps) => {
        try {
            setLoading(true)

            setRecipe(prevRecipe => {
                const updatedRecipe = { ...prevRecipe, ingredients: prevRecipe?.ingredients.map(ingredient => ingredient.inventory_item.id === ingredient_id ? { ...ingredient, ...item } : ingredient) }
                return updatedRecipe as Recipe
            })

            const response = await fetch(`/api/recipe/${menu_item_id}/${ingredient_id}`, {
                method: "PUT",
                body: JSON.stringify(item)
            })

            if (!response.ok) {
                throw new Error("Failed to update ingredient")
            }

        } catch (error) {
            setRecipe(prevRecipe => {
                const updatedRecipe = { ...prevRecipe, ingredients: prevRecipe?.ingredients.map(ingredient => ingredient.inventory_item.id === ingredient_id ? { ...ingredient, ...item } : ingredient) }
                return updatedRecipe as Recipe
            })
            console.error("Error updating ingredient:", error)
            setError("Failed to update ingredient")
        }
    }

    useEffect(() => {
        if (menu_item_id) {
            getMenuItem()
        }
    }, [menu_item_id])


    return { recipe, loading, error, updateIngredient, addIngredient, deleteIngredient }
}