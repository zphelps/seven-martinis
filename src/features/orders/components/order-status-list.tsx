import { Order } from "@/types/order";
import { OrderStatusCard } from "./order-status-card";

interface OrderStatusListProps {
    orders: Order[];
    setOrders: (orders: Order[]) => void;
}

export function OrderStatusList({ orders, setOrders }: OrderStatusListProps) {
    return (
        <div className="flex flex-col gap-2 p-2 pt-4">
            {orders.map((order: Order) => (
                <div key={order.id}>
                    <OrderStatusCard order={order} setOrders={setOrders} />
                </div>
            ))}
        </div>
    )
}