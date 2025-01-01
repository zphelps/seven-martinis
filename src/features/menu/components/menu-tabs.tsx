import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderStatusList } from "@/features/orders/components/order-status-list";
import { PlaceOrderCard } from "@/features/orders/components/place-order-card";
import { PlusIcon } from "lucide-react";
import { MartiniIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const MenuTabs = () => {
    const [tab, setTab] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleTabChange = (tab: string) => {
        setTab(tab);
        router.push(`/menu?tab=${tab}`);
    }

    useEffect(() => {
        const tab = searchParams.get('tab') || "menu";
        setTab(tab);
    }, [searchParams]);

    return (
        <Tabs value={tab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-200">
                <TabsTrigger value="menu" onClick={() => handleTabChange('menu')}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Place Order
                </TabsTrigger>
                <TabsTrigger value="orders" onClick={() => handleTabChange('orders')}>
                    <MartiniIcon className="w-4 h-4 mr-2" />
                    Orders
                </TabsTrigger>
            </TabsList>
            <TabsContent value="menu">
                <PlaceOrderCard />
            </TabsContent>
            <TabsContent value="orders">
                <OrderStatusList />
            </TabsContent>
        </Tabs>
    )
}