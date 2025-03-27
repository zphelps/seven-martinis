"use client"

import React from 'react'
import MenuNavBar from "@/features/menu/components/menu-nav-bar";
import { OrderStatusList } from "@/features/orders/components/order-status-list";
import { MenuList } from "@/features/menu/components/menu-item-list";
import useMenu from "@/features/menu/hooks/use-menu";
import { useSearchParams } from "next/navigation";
import { useUserOrders } from '@/features/orders/hooks/use-user-orders';
import { useUid } from '@/features/orders/hooks/use-uid';

export default function Menu() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || "menu";
    const { menuItems, loading, error } = useMenu({ onlyAvailable: true });

    const { uid } = useUid();
    const { orders, setOrders, loading: ordersLoading, error: ordersError } = useUserOrders(uid);

    return (
        <div className="bg-gray-50 min-h-screen">
            <MenuNavBar />
            <div>
                {tab === "menu" ? (
                    <MenuList
                        menuItems={menuItems}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    <OrderStatusList orders={orders} setOrders={setOrders} />
                )}
            </div>
        </div>
    )
}
