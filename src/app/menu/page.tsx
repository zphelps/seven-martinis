"use client"

import React, { useEffect, useState } from 'react'
import MenuNavBar from "@/features/menu/components/menu-nav-bar";
import { MenuItemsCombobox } from "@/features/menu/components/menu-items-combobox";
import { MenuItem, Order, OrderItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import useMenu from '@/features/menu/hooks/use-menu';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUserOrders } from '@/features/orders/hooks/use-user-orders';
import { OrderStatusCard } from '@/features/orders/components/order-status-card';
import { OrderStatusList } from '@/features/orders/components/order-status-list';
import { PlaceOrderCard } from '@/features/orders/components/place-order-card';

export default function Menu() {
    const [uid, setUid] = useState<string | null>(null);
    const { orders, setOrders, loading: ordersLoading, error: ordersError } = useUserOrders(uid);
    const { menuItems, loading: menuItemsLoading, error: menuItemsError } = useMenu();

    useEffect(() => {
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUid(storedUid);
        } else {
            // Generate a new uid and save it
            const newUid = crypto.randomUUID();
            localStorage.setItem('uid', newUid);
            setUid(newUid);
        }
    }, []);

    return (
        <div>
            <MenuNavBar />

            <div className="max-w-screen-sm mx-auto">
                {orders.length > 0 && <OrderStatusList orders={orders} setOrders={setOrders} />}
                {orders.length === 0 && <PlaceOrderCard menuItems={menuItems} uid={uid} />}
            </div>

        </div>
    )
}
