import { Order } from "@/types/order";
import OrderDialog from "./order-dialog";
import { format } from "date-fns";
import { Clock, User } from "lucide-react";

interface OrderKanbanCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

export default function OrderKanbanCard({ order, onClick }: OrderKanbanCardProps) {
    return (
        <div
            onClick={() => onClick(order)}
            key={order.id}
            className="p-4 mt-1 w-[290px] bg-white rounded-lg shadow-sm border border-border hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
        >
            {/* Header with name and time */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                    </div> */}
                    <p className="font-semibold text-foreground truncate">{order.customer_name}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded flex-shrink-0 ml-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{format(new Date(order.created_at), 'h:mm a')}</span>
                </div>
            </div>

            {/* Drink items */}
            <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-baseline gap-2 min-w-0 flex-1">
                            <span className="font-mono text-xs text-primary font-semibold flex-shrink-0">
                                {item.quantity}×
                            </span>
                            <span className="text-foreground font-medium truncate">
                                {item.name}
                            </span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded flex-shrink-0 ml-2">
                            #{item.drink_number}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
