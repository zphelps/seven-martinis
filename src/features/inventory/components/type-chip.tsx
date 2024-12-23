export default function TypeChip({ type }: { type: string }) {
    const getColor = (type: string) => {
        switch (type) {
            case "garnish":
                return "bg-teal-100";
            case "liquor":
                return "bg-blue-100";
            case "liqueur":
                return "bg-purple-100";
            case "bitters":
                return "bg-pink-100";
            case "juice":
                return "bg-indigo-100";
            case "syrup":
                return "bg-orange-100";
            case "fruit":
                return "bg-yellow-100";
            case "other":
                return "bg-gray-100";
            default:
                return "bg-gray-100";
        }
    };

    const getText = (type: string) => {
        switch (type) {
            case "garnish":
                return "Garnish";
            case "liquor":
                return "Liquor";
            case "liqueur":
                return "Liqueur";
            case "bitters":
                return "Bitters";
            case "juice":
                return "Juice";
            case "syrup":
                return "Syrup";
            case "fruit":
                return "Fruit";
            case "other":
                return "Other";
            default:
                return "Unknown";
        }
    };

    return (
        <div className={`${getColor(type)} w-fit rounded-full px-2 py-1 text-xs`}>
            {getText(type)}
        </div>
    );
}