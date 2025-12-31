"use client"

import React from 'react'
import MenuNavBar from "@/features/menu/components/menu-nav-bar";
import { OrderStatusList } from "@/features/orders/components/order-status-list";
import { MenuList } from "@/features/menu/components/menu-item-list";
import { MobileBottomNav } from "@/features/menu/components/mobile-bottom-nav";
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
        <div className="flex flex-col h-screen bg-background">
            <MenuNavBar />

            <main className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="mx-auto max-w-4xl h-full">
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
            </main>

            <MobileBottomNav />
        </div>
    )
}
