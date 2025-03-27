import { Order } from "@/types/order";
import OrderDialog from "./order-dialog";
import { format } from "date-fns";

interface OrderKanbanCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

export default function OrderKanbanCard({ order, onClick }: OrderKanbanCardProps) {
    return (
        <div onClick={() => onClick(order)} key={order.id} className="p-4 mt-2 w-[290px] bg-white rounded shadow">
            <div className="flex items-center justify-between">
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{format(new Date(order.created_at), 'MM/dd h:mm a')}</p>
            </div>
            {order.items.map((item: any, index: number) => (
                <p key={index} className="text-sm text-gray-500">
                    {item.quantity}x {item.name} (#{item.drink_number})
                </p>
            ))}
        </div>
    );
}