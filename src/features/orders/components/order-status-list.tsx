"use client";

import { Order } from "@/types/order";
import { OrderStatusCard } from "./order-status-card";
import { isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { Martini } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface OrderStatusListProps {
    orders: Order[];
    setOrders: Dispatch<SetStateAction<Order[]>>;
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

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-border shadow-sm">
                    <Martini className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-serif font-medium text-foreground">No orders yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your order history will appear here once you place an order.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 space-y-8 pb-20 md:pb-6">
            {Object.entries(groupedOrders).map(([groupKey, groupOrders]) => {
                if (groupOrders.length === 0) return null;

                return (
                    <div key={groupKey} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                {getDateGroupTitle(groupKey)}
                            </h2>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
