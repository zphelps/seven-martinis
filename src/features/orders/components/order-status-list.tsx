import { Order } from "@/types/order";
import { OrderStatusCard } from "./order-status-card";
import { useUserOrders } from "../hooks/use-user-orders";
import { useUid } from "../hooks/use-uid";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

interface OrderStatusListProps {
    orders: Order[];
    setOrders: (orders: Order[]) => void;
}

function groupOrdersByDate(orders: Order[]) {
    const groups: { [key: string]: Order[] } = {
        today: [],
        yesterday: [],
        thisWeek: [],
        thisMonth: [],
        thisYear: []
    };

    orders.forEach(order => {
        const orderDate = new Date(order.created_at);
        if (isToday(orderDate)) {
            groups.today.push(order);
        } else if (isYesterday(orderDate)) {
            groups.yesterday.push(order);
        } else if (isThisWeek(orderDate)) {
            groups.thisWeek.push(order);
        } else if (isThisMonth(orderDate)) {
            groups.thisMonth.push(order);
        } else {
            groups.thisYear.push(order);
        }
    });

    return groups;
}

function getDateGroupTitle(groupKey: string): string {
    switch (groupKey) {
        case 'today':
            return 'Today';
        case 'yesterday':
            return 'Yesterday';
        case 'thisWeek':
            return 'This Week';
        case 'thisMonth':
            return 'This Month';
        case 'thisYear':
            return 'This Year';
        default:
            return groupKey;
    }
}

export function OrderStatusList({ orders, setOrders }: OrderStatusListProps) {
    const groupedOrders = groupOrdersByDate(orders);

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-4">
            {Object.entries(groupedOrders).map(([groupKey, groupOrders]) => {
                if (groupOrders.length === 0) return null;

                return (
                    <div key={groupKey} className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {getDateGroupTitle(groupKey)}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupOrders.map((order: Order) => (
                                <OrderStatusCard
                                    key={order.id}
                                    order={order}
                                    setOrders={setOrders}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}