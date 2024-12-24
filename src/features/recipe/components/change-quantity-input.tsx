import { useState, useEffect, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { UpdateIngredientProps } from "../hooks/use-recipe"

interface ChangeQuantityInputProps {
    ingredient_id: string
    quantity: number
    updateIngredient: (id: string, item: UpdateIngredientProps) => Promise<void>
}

export const ChangeQuantityInput = ({ ingredient_id, quantity, updateIngredient }: ChangeQuantityInputProps) => {
    const [localQuantity, setLocalQuantity] = useState<string>(quantity.toString())

    // Whenever quantity changes from outside, keep them in sync
    useEffect(() => {
        setLocalQuantity(quantity.toString())
    }, [quantity])

    // Handle immediate state updates
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalQuantity(e.target.value)
    }

    // Trigger the update on blur (i.e. when the user leaves the input field)
    const handleBlur = async () => {
        const parsedQuantity = parseFloat(localQuantity)
        if (!isNaN(parsedQuantity)) {
            await updateIngredient(ingredient_id, { quantity: parsedQuantity })
        }
    }

    return (
        <Input
            value={localQuantity}
            onChange={handleChange}
            onBlur={handleBlur}
            type="number"
            className="w-10 h-8 text-center ring-0 ring-transparent focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:ring-transparent border-0 bg-gray-50 rounded-md px-0 py-0 hover:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs"
        />
    )
}
