import { UpdateMenuItemProps } from "@/features/menu/hooks/use-menu";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState, useRef } from "react";
import { MenuItem } from "@/types/order";
import { debounce } from "lodash";

interface ChangeDrinkNameProps {
    item: MenuItem | null;
    updateMenuItem: (id: string, item: UpdateMenuItemProps) => Promise<void>;
}

export const ChangeDrinkName = ({ item, updateMenuItem }: ChangeDrinkNameProps) => {
    const [name, setName] = useState(item?.name);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const debouncedUpdateMenuItem = useCallback(
        debounce(async (id: string, updatedName: string) => {
            // Only update if the name is empty or has content
            await updateMenuItem(id, {
                name: updatedName,
                // available: updatedName.trim() !== ""
            });
        }, 500),
        []
    );

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        debouncedUpdateMenuItem(item?.id || "", newName);
    };

    useEffect(() => {
        setName(item?.name || "");
    }, [item]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <div className="hover:cursor-pointer flex w-full rounded-r-md px-1 py-0.5 hover:bg-gray-50" onClick={() => setEditing(true)}>
            {editing ? (
                <Input
                    ref={inputRef}
                    placeholder="Enter a name..."
                    value={name || ""}
                    onChange={handleNameChange}
                    onBlur={() => setEditing(false)}
                    className="hover:cursor-pointer focus:cursor-text w-full h-8 focus-visible:ring-offset-0 ring-0 focus:border-transparent focus-visible:border-transparent ring-transparent focus-visible:ring-0 focus-visible:ring-transparent border-0 bg-transparent outline-none rounded-md px-0 py-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium"
                />
            ) : (
                <div className="flex gap-1">
                    {(name && name.trim() !== "") && <p className="text-lg font-bold text-black hover:cursor-pointer">
                        {name}
                    </p>}
                    {(!name || name.trim() === "") && <p className="text-lg ml-1 text-gray-500 hover:cursor-pointer">
                        Enter a name...
                    </p>}
                </div>
            )}
        </div>
    );
}