import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { UpdateInventoryItemProps } from "../hooks/use-inventory";
import { toast } from "@/components/ui/use-toast";
import { CircleIcon, SparklesIcon, BeerIcon, FlameIcon } from "lucide-react";

interface ChangeTypeSelectProps {
    id: string;
    type: string;
    updateInventoryItem: (id: string, item: UpdateInventoryItemProps) => Promise<void>;
}

export const ChangeTypeSelect = ({ id, type, updateInventoryItem }: ChangeTypeSelectProps) => {
    const [selectedType, setSelectedType] = useState(type);

    const handleChange = async (value: string) => {
        setSelectedType(value);
        await updateInventoryItem(id, { type: value });

        toast({
            title: `Item type changed to "${value}".`,
            variant: "default",
        });
    };

    useEffect(() => {
        setSelectedType(type);
    }, [type]);

    return (
        <Select value={selectedType} onValueChange={handleChange}>
            <SelectTrigger className="ring-0 ring-transparent focus:ring-0 w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs">
                {selectedType === "garnish" && <SparklesIcon className="w-4 h-4 text-green-500" />}
                {selectedType === "liquor" && <FlameIcon className="w-4 h-4 text-blue-500" />}
                {selectedType === "liqueur" && <BeerIcon className="w-4 h-4 text-yellow-600" />}
                {selectedType === "bitters" && <CircleIcon className="w-4 h-4 text-red-500" />}
                {selectedType === "juice" && <CircleIcon className="w-4 h-4 text-orange-500" />}
                {selectedType === "syrup" && <CircleIcon className="w-4 h-4 text-purple-500" />}
                {selectedType === "fruit" && <CircleIcon className="w-4 h-4 text-pink-500" />}
                {selectedType === "other" && <CircleIcon className="w-4 h-4 text-gray-400" />}
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="garnish">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <SparklesIcon className="w-4 h-4 text-green-500" />
                        <p>Garnish</p>
                    </div>
                </SelectItem>
                <SelectItem value="liquor">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <FlameIcon className="w-4 h-4 text-blue-500" />
                        <p>Liquor</p>
                    </div>
                </SelectItem>
                <SelectItem value="liqueur">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <BeerIcon className="w-4 h-4 text-yellow-600" />
                        <p>Liqueur</p>
                    </div>
                </SelectItem>
                <SelectItem value="bitters">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <CircleIcon className="w-4 h-4 text-red-500" />
                        <p>Bitters</p>
                    </div>
                </SelectItem>
                <SelectItem value="juice">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <CircleIcon className="w-4 h-4 text-orange-500" />
                        <p>Juice</p>
                    </div>
                </SelectItem>
                <SelectItem value="syrup">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <CircleIcon className="w-4 h-4 text-purple-500" />
                        <p>Syrup</p>
                    </div>
                </SelectItem>
                <SelectItem value="fruit">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <CircleIcon className="w-4 h-4 text-pink-500" />
                        <p>Fruit</p>
                    </div>
                </SelectItem>
                <SelectItem value="other">
                    <div className="flex items-center gap-2 py-2 -ml-4">
                        <CircleIcon className="w-4 h-4 text-gray-400" />
                        <p>Other</p>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
