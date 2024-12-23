import { Order } from "@/types/order";
import { OrderStatusCard } from "./order-status-card";
import { useUserOrders } from "../hooks/use-user-orders";
import { useUid } from "../hooks/use-uid";

export function OrderStatusList() {
    const { uid } = useUid();
    const { orders, setOrders, loading: ordersLoading, error: ordersError } = useUserOrders(uid);

    return (
        <div className="flex flex-col gap-2 p-2 pt-2">
            {orders.map((order: Order) => (
                <div key={order.id}>
                    <OrderStatusCard order={order} setOrders={setOrders} />
                </div>
            ))}
        </div>
    )
}