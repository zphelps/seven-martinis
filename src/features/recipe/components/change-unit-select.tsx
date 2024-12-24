import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { UpdateIngredientProps } from "../hooks/use-recipe";

interface ChangeUnitSelectProps {
    ingredient_id: string;
    unit: string;
    updateIngredient: (id: string, item: UpdateIngredientProps) => Promise<void>;
}

export const ChangeUnitSelect = ({ ingredient_id, unit, updateIngredient }: ChangeUnitSelectProps) => {
    const [selectedUnit, setSelectedUnit] = useState(unit);

    const handleChange = async (value: string) => {
        setSelectedUnit(value);
        await updateIngredient(ingredient_id, { unit: value });
    }

    useEffect(() => {
        setSelectedUnit(unit);
    }, [unit]);

    return (
        <Select
            value={selectedUnit}
            onValueChange={handleChange}
        >
            <SelectTrigger
                className="ring-0 font-medium ring-transparent focus:ring-0 focus:ring-transparent h-8 min-w-14 w-14 bg-gray-50 hover:bg-gray-100 border-0 rounded-md pl-2 pr-1 text-xs"
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="oz" side="left">
                    oz
                </SelectItem>
                <SelectItem value="g" side="left">
                    g
                </SelectItem>
                <SelectItem value="ml" side="left">
                    ml
                </SelectItem>
                <SelectItem value="tsp" side="left">
                    tsp
                </SelectItem>
                <SelectItem value="tbsp" side="left">
                    tbsp
                </SelectItem>
            </SelectContent>
        </Select>
    )
}