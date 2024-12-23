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
import { Loader2, MartiniIcon, PlusIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUserOrders } from '@/features/orders/hooks/use-user-orders';
import { MenuTabs } from '@/features/menu/components/menu-tabs';

export default function Menu() {
    // const { orders, setOrders, loading: ordersLoading, error: ordersError } = useUserOrders(uid);

    return (
        <div>
            <MenuNavBar />

            <MenuTabs />

        </div>
    )
}
