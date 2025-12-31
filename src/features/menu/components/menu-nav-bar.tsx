"use client";

import { useState, useEffect } from "react";
import { CreditCard, Martini, Receipt } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { cn } from "@/lib/utils";

export default function MenuNavBar() {
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
        <header className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-10">
            <nav aria-label="Global" className="mx-auto flex items-center justify-between max-w-4xl px-3 py-2">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0">
                    <a href="#" className="flex items-center gap-0">
                        <span className="sr-only">Seven Martinis</span>
                        <img
                            alt="Seven Martinis"
                            src="7MPrimaryCropped.png"
                            className="h-12 md:h-14 max-w-fit"
                        />
                    </a>
                </div>

                {/* Right side - Tabs + Tip Button */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Navigation Tabs - Now visible on all screens */}
                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
                        <button
                            onClick={() => handleTabChange('menu')}
                            className={cn(
                                "flex items-center gap-2 px-3.5 md:px-4 py-2 rounded-md font-medium transition-colors text-sm whitespace-nowrap",
                                tab === 'menu'
                                    ? "bg-white text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Martini className="w-4 h-4" />
                            <span>Menu</span>
                        </button>
                        <button
                            onClick={() => handleTabChange('orders')}
                            className={cn(
                                "flex items-center gap-2 px-3.5 md:px-4 py-2 rounded-md font-medium transition-colors text-sm whitespace-nowrap",
                                tab === 'orders'
                                    ? "bg-white text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Receipt className="w-4 h-4" />
                            <span>Orders</span>
                        </button>
                    </div>

                    {/* Tip Button */}
                    {config.features.tipping && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-brand-amber text-brand-amber hover:bg-brand-amber hover:text-white flex-shrink-0"
                            onClick={() => window.open(config.features.tipUrl, '_blank')}
                        >
                            <CreditCard className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Tip</span>
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    )
}
