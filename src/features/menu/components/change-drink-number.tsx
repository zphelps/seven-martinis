import { Input } from "@/components/ui/input";
import { MenuItem } from "@/types/order";
import { useState, useEffect, useRef } from "react";
import { UpdateMenuItemProps } from "../hooks/use-menu";

interface ChangeDrinkNumberProps {
    item: MenuItem | null;
    updateMenuItem: (id: string, item: UpdateMenuItemProps) => Promise<void>;
}

export const ChangeDrinkNumber = ({ item, updateMenuItem }: ChangeDrinkNumberProps) => {
    const [currentDrinkNumber, setCurrentDrinkNumber] = useState(item?.drink_number);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChangeDrinkNumber = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!item?.id) return;
        const newDrinkNumber = e.target.value ? parseInt(e.target.value) : 0;
        setCurrentDrinkNumber(newDrinkNumber);
        if (newDrinkNumber === 0) {
            await updateMenuItem(item.id, { drink_number: newDrinkNumber, available: false });
        } else {
            await updateMenuItem(item.id, { drink_number: newDrinkNumber });
        }
    };

    useEffect(() => {
        setCurrentDrinkNumber(item?.drink_number);
    }, [item]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <div className="flex gap-1 hover:cursor-pointer items-center rounded-l-md pl-1 py-0.5 hover:bg-gray-50" onClick={() => setEditing(true)}>
            <p className="text-md font-medium -mr-0.5">#</p>
            {editing ? (
                <Input
                    ref={inputRef}
                    placeholder="0"
                    disabled={!item?.id}
                    type="number"
                    value={currentDrinkNumber || ""}
                    onChange={handleChangeDrinkNumber}
                    onBlur={() => setEditing(false)}
                    className="hover:cursor-pointer focus:cursor-text w-auto h-8 focus-visible:ring-offset-0 ring-0 focus:border-transparent focus-visible:border-transparent ring-transparent focus-visible:ring-0 focus-visible:ring-transparent border-0 bg-transparent outline-none rounded-md px-0 py-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                    style={{ width: `${(currentDrinkNumber?.toString().length || 1)}ch` }}
                />
            ) : (
                <div>
                    {(currentDrinkNumber !== 0) && <p className="text-lg font-semibold text-black hover:cursor-pointer">
                        {currentDrinkNumber || "0"}.
                    </p>}
                    {(!currentDrinkNumber || currentDrinkNumber === 0) && <p className="text-lg font-normal text-gray-500 hover:cursor-pointer">
                        {currentDrinkNumber || "0"}.
                    </p>}
                </div>

            )}
        </div>
    );
}