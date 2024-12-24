import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateInventoryItemProps } from "../hooks/use-inventory";
import { useEffect, useState } from "react";
import { CheckIcon, CheckSquare, CircleAlert, OctagonAlert, SquareCheck, SquareX, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface ChangeStockSelectProps {
    id: string;
    stock: string;
    updateInventoryItem: (id: string, item: UpdateInventoryItemProps) => Promise<void>;
}


export const ChangeStockSelect = ({ id, stock, updateInventoryItem }: ChangeStockSelectProps) => {
    const [selectedStock, setSelectedStock] = useState(stock);

    const handleChange = async (value: string) => {
        setSelectedStock(value);
        await updateInventoryItem(id, { stock: value });
        let description = "";
        switch (value) {
            case "full":
                description = "Stock level is now full.";
                break;
            case "low":
                description = "Stock level is running low.";
                break;
            case "out":
                description = "Stock is out.";
                break;
            default:
                description = "Stock level updated successfully.";
        }

        toast({
            title: description,
            variant: "default",
        })
    };

    useEffect(() => {
        setSelectedStock(stock);
    }, [stock]);

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedStock}
                onValueChange={handleChange}
            >
                <SelectTrigger
                    className="ring-0 ring-transparent focus:ring-0 focus:ring-transparent w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-xs"
                >
                    {selectedStock === "full" && <SquareCheck className="w-4 h-4 text-green-500" />}
                    {selectedStock === "low" && <TriangleAlert className="w-4 h-4 text-yellow-500" />}
                    {selectedStock === "out" && <CircleAlert className="w-4 h-4 text-red-500" />}
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="full" side="right">
                        <div className="flex items-center gap-2 py-2 -ml-4">
                            <SquareCheck className="w-4 h-4 text-green-500" />
                            <p>Full</p>
                        </div>
                    </SelectItem>
                    <SelectItem value="low" side="right">
                        <div className="flex items-center gap-2 py-2 -ml-4">
                            <TriangleAlert className="w-4 h-4 text-yellow-500" />
                            <p>Low</p>
                        </div>
                    </SelectItem>
                    <SelectItem value="out" side="right">
                        <div className="flex items-center gap-2 py-2 -ml-4">
                            <CircleAlert className="w-4 h-4 text-red-500" />
                            <p>Out</p>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}