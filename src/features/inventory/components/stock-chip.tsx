import { CheckIcon, XIcon } from "lucide-react";
import { AlertTriangleIcon } from "lucide-react";

export const StockChip = ({ stock }: { stock: string }) => {
    const getColor = (stock: string) => {
        switch (stock) {
            case "full":
                return "bg-green-100";
            case "low":
                return "bg-yellow-100";
            case "out":
                return "bg-red-100";
        }
    }

    const getText = (stock: string) => {
        switch (stock) {
            case "full":
                return "Full";
            case "low":
                return "Low";
            case "out":
                return "Out";
        }
    }

    const getIcon = (stock: string) => {
        switch (stock) {
            case "full":
                return <CheckIcon className="w-4 h-4 -mr-0.5" />;
            case "low":
                return <AlertTriangleIcon className="w-4 h-4" />;
            case "out":
                return <XIcon className="w-4 h-4 -mr-1" />;
        }
    }

    return (
        <div className={`${getColor(stock)} w-fit rounded-full px-2 pr-2.5 py-1 text-xs flex items-center gap-2`}>
            {getIcon(stock)}
            {getText(stock)}
        </div>
    )
}