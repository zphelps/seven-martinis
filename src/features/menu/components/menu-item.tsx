
export default function MenuItem({ item }: { item: any }) {
    return (
        <div className="border border-gray-300 rounded-md p-3">
            <div className="flex space-x-2 items-center">
                <p className="text-sm text-gray-500">#{item.drink_number}</p>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price}</p>
            </div>
            <p className="text-sm text-gray-500">{item.description}</p>
        </div>
    )
}