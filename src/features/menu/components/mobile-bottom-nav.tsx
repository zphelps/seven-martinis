"use client";

import { Martini, Receipt } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get('tab') || "menu";

    const handleTabChange = (tab: string) => {
        router.push(`/menu?tab=${tab}`);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border md:hidden pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16 px-4">
                <button
                    onClick={() => handleTabChange('menu')}
                    className={cn(
                        "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all",
                        activeTab === 'menu'
                            ? "text-primary"
                            : "text-muted-foreground active:text-foreground"
                    )}
                >
                    <div className={cn(
                        "p-2 rounded-full transition-all",
                        activeTab === 'menu' && "bg-primary/10"
                    )}>
                        <Martini className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Menu</span>
                </button>
                <button
                    onClick={() => handleTabChange('orders')}
                    className={cn(
                        "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all",
                        activeTab === 'orders'
                            ? "text-primary"
                            : "text-muted-foreground active:text-foreground"
                    )}
                >
                    <div className={cn(
                        "p-2 rounded-lg transition-all",
                        activeTab === 'orders' && "bg-primary/10"
                    )}>
                        <Receipt className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Orders</span>
                </button>
            </div>
        </div>
    );
}
