import { Order } from "@/types/order";
import OrderDialog from "./order-dialog";
import { format } from "date-fns";
import { Martini, Clock } from "lucide-react";

interface OrderKanbanCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

export default function OrderKanbanCard({ order, onClick }: OrderKanbanCardProps) {
    return (
        <div
            onClick={() => onClick(order)}
            key={order.id}
            className="p-4 mt-2 w-[290px] bg-white rounded-lg shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                        <Martini className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">{order.customer_name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(order.created_at), 'h:mm a')}</span>
                </div>
            </div>
            <div className="space-y-1 pl-10">
                {order.items.map((item: any, index: number) => (
                    <p key={index} className="text-sm text-muted-foreground">
                        {item.quantity}x {item.name}
                        <span className="text-xs ml-1 font-mono">#{item.drink_number}</span>
                    </p>
                ))}
            </div>
        </div>
    );
}
