import { Switch } from "@/components/ui/switch"
import { MenuItem } from "@/types/order";
import { UpdateMenuItemProps } from "@/features/menu/hooks/use-menu";
import { useEffect } from "react";
import { useState } from "react";

interface ChangeAvailabilityProps {
    item: MenuItem | null;
    updateMenuItem: (id: string, item: UpdateMenuItemProps) => Promise<void>;
}

export const ChangeAvailability = ({ item, updateMenuItem }: ChangeAvailabilityProps) => {
    const [availability, setAvailability] = useState(item?.available);

    const showWarning = item?.name === "" || item?.drink_number === 0 || item?.drink_number === null || item?.name === null;

    const handleAvailabilityChange = async (checked: boolean) => {
        if (!item?.id) return;
        setAvailability(checked);
        await updateMenuItem(item?.id, { available: checked });
    }

    useEffect(() => {
        setAvailability(item?.available);
    }, [item]);

    return (
        <div className="px-3">
            <div className="flex items-center justify-between">
                <div className="">
                    <p className="text-sm font-semibold text-black">
                        Availability
                    </p>
                    <p className="text-xs font-normal text-gray-500">
                        Show this drink in the menu
                    </p>
                </div>
                <Switch
                    disabled={showWarning}
                    checked={availability}
                    onCheckedChange={handleAvailabilityChange}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                />
            </div>
            {showWarning && (
                <p className="text-xs font-normal text-red-500 p-2 rounded-md bg-red-50 mt-2 border border-red-200">
                    Fill in the name and drink number to make this drink available.
                </p>
            )}
        </div>

    )
}