"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MenuItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Martini, Heart, CheckCircle2, Snowflake, Sun, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { OrderItem } from "@/types/order";
import { useUid } from "@/features/orders/hooks/use-uid";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import {
    ACTIVE_SEASONAL_MENU,
    getActiveSeasonalDialogTheme,
    isActiveSeasonalDrink,
} from "../../config/seasonal-menu";

interface ItemDialogProps {
    menuItem: MenuItem;
    children: React.ReactNode;
}

export const ItemDialog = ({ menuItem, children }: ItemDialogProps) => {
    const [open, setOpen] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showTipPrompt, setShowTipPrompt] = useState(false);
    const { uid } = useUid();
    const router = useRouter();
    const scrollPositionRef = useRef(0);

    const isSeasonalDrink = isActiveSeasonalDrink(menuItem.tags);
    const seasonalTheme = isSeasonalDrink ? getActiveSeasonalDialogTheme() : null;
    const SeasonalIcon = ACTIVE_SEASONAL_MENU === "winter" ? Snowflake : Sun;

    const handlePlaceOrder = async () => {
        if (!customerName.trim()) {
            toast({
                title: "Please enter your name",
                variant: "destructive",
            });
            return;
        }

        setPlacingOrder(true);

        const orderItems: OrderItem[] = [{
            menu_item_id: menuItem.id,
            quantity: 1,
            name: menuItem.name,
            instructions: "",
            recipe: menuItem.recipe
        }];

        const order = {
            uid,
            customer_name: customerName.trim(),
            items: orderItems
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify(order),
            });

            if (response.ok) {
                setShowSuccess(true);

                setTimeout(() => {
                    if (config.features.tipping) {
                        setShowSuccess(false);
                        setShowTipPrompt(true);
                    } else {
                        handleClose();
                    }
                }, 2000);
            } else {
                toast({
                    title: "Failed to place order",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "An error occurred",
                variant: "destructive",
            });
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setCustomerName("");
            setShowSuccess(false);
            setShowTipPrompt(false);
        }, 300);
        router.push('/menu?tab=orders');
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            // Save scroll position before opening
            const scrollContainer = document.querySelector('main');
            if (scrollContainer) {
                scrollPositionRef.current = scrollContainer.scrollTop;
            }
        }

        setOpen(isOpen);

        if (!isOpen) {
            // Restore scroll position after closing
            setTimeout(() => {
                const scrollContainer = document.querySelector('main');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollPositionRef.current;
                }
                setCustomerName("");
                setShowSuccess(false);
                setShowTipPrompt(false);
            }, 50);
        }
    }

    const handleTip = () => {
        window.open(config.features.tipUrl, '_blank');
        handleClose();
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange} modal={false}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent
                side="right"
                className={cn(
                    "w-full sm:max-w-md p-0 border-l [&>button]:hidden",
                    isSeasonalDrink && seasonalTheme
                        ? seasonalTheme.sheet
                        : "bg-background border-border"
                )}
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Order {menuItem.name}</SheetTitle>
                </SheetHeader>

                {/* Custom close button that adapts to theme */}
                <div className="absolute right-4 top-4 z-[100]">
                    <button
                        onClick={() => setOpen(false)}
                        className={cn(
                            "rounded-full p-2.5 transition-all",
                            isSeasonalDrink && seasonalTheme
                                ? seasonalTheme.closeButton
                                : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                        )}
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                {/* Decorative seasonal icons */}
                {isSeasonalDrink && (
                    <>
                        <div className="absolute top-20 right-8 opacity-10 pointer-events-none">
                            <SeasonalIcon className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute bottom-32 left-6 opacity-10 pointer-events-none">
                            <SeasonalIcon className="w-20 h-20 text-white" />
                        </div>
                        <div className="absolute top-1/3 right-1/4 opacity-5 pointer-events-none">
                            <SeasonalIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute top-1/2 left-8 opacity-5 pointer-events-none">
                            <SeasonalIcon className="w-8 h-8 text-white" />
                        </div>
                    </>
                )}

                {/* Success State */}
                {showSuccess && (
                    <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-6 animate-fade-in pb-20 relative z-10">
                        <div className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center border-2",
                            isSeasonalDrink && seasonalTheme
                                ? seasonalTheme.successIconBg
                                : "bg-green-50 border-green-200"
                        )}>
                            <CheckCircle2 className={cn(
                                "w-14 h-14",
                                isSeasonalDrink && seasonalTheme ? seasonalTheme.successIcon : "text-green-600"
                            )} />
                        </div>
                        <div className="space-y-2">
                            <h2 className={cn(
                                "text-3xl font-serif font-semibold",
                                isSeasonalDrink && seasonalTheme ? seasonalTheme.heading : "text-foreground"
                            )}>Order Placed!</h2>
                            <p className={cn(
                                "text-xl",
                                isSeasonalDrink && seasonalTheme ? seasonalTheme.bodyText : "text-muted-foreground"
                            )}>
                                We&apos;re crafting your drink, {customerName}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tip Prompt */}
                {showTipPrompt && (
                    <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-8 animate-fade-in pb-20 relative z-10">
                        <div className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center border",
                            isSeasonalDrink && seasonalTheme
                                ? seasonalTheme.tipIconBg
                                : "bg-accent/10 border-accent/30"
                        )}>
                            <Heart className={cn(
                                "w-10 h-10",
                                isSeasonalDrink && seasonalTheme ? seasonalTheme.tipIcon : "text-accent"
                            )} />
                        </div>
                        <div className="space-y-3">
                            <h2 className={cn(
                                "text-2xl font-serif font-semibold",
                                isSeasonalDrink && seasonalTheme ? seasonalTheme.heading : "text-foreground"
                            )}>Support the Bartender</h2>
                            <p className={cn(
                                "text-lg",
                                isSeasonalDrink && seasonalTheme ? seasonalTheme.bodyText : "text-muted-foreground"
                            )}>
                                Your generosity keeps the craft alive
                            </p>
                        </div>
                        <div className="flex flex-col w-full max-w-xs gap-4">
                            <Button
                                size="lg"
                                className={cn(
                                    "w-full h-16 text-lg font-medium",
                                    isSeasonalDrink && seasonalTheme
                                        ? seasonalTheme.tipButton
                                        : "bg-accent hover:bg-accent/90 text-accent-foreground"
                                )}
                                onClick={handleTip}
                            >
                                <Heart className="w-5 h-5 mr-2" />
                                Leave a Tip
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className={cn(
                                    "w-full h-12",
                                    isSeasonalDrink && seasonalTheme
                                        ? seasonalTheme.ghostButton
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={handleClose}
                            >
                                Skip for now
                            </Button>
                        </div>
                    </div>
                )}

                {/* Order Form */}
                {!showSuccess && !showTipPrompt && (
                    <div className="flex flex-col h-full relative z-10">
                        {/* Scrollable drink info section */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center p-6 space-y-4 pt-12">
                                <div className="text-center space-y-4 max-w-md mx-auto">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            isSeasonalDrink && seasonalTheme
                                                ? seasonalTheme.badge
                                                : "border-border text-muted-foreground"
                                        )}
                                    >
                                        #{menuItem.drink_number}
                                    </Badge>
                                    <h2 className={cn(
                                        "text-3xl md:text-4xl font-serif font-semibold leading-tight",
                                        isSeasonalDrink && seasonalTheme ? seasonalTheme.heading : "text-foreground"
                                    )}>
                                        {menuItem.name}
                                    </h2>
                                    <p className={cn(
                                        "text-lg leading-relaxed",
                                        isSeasonalDrink && seasonalTheme ? seasonalTheme.bodyText : "text-muted-foreground"
                                    )}>
                                        {menuItem.description}
                                    </p>

                                    {menuItem.tags && menuItem.tags.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                                            {menuItem.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className={cn(
                                                        "py-1.5 px-3",
                                                        isSeasonalDrink && seasonalTheme
                                                            ? seasonalTheme.tagBadge
                                                            : "bg-white border border-border text-foreground"
                                                    )}
                                                >
                                                    <Image
                                                        src={`/${tag.toLowerCase()}.png`}
                                                        className={cn(
                                                            "mr-1.5 h-4 w-auto",
                                                            isSeasonalDrink ? "opacity-90" : "opacity-80"
                                                        )}
                                                        alt={tag}
                                                        height={16}
                                                        width={16}
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                    <span className="text-xs">{tag}</span>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fixed input section at bottom */}
                        <div className={cn(
                            "flex-shrink-0 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]",
                            isSeasonalDrink && seasonalTheme
                                ? seasonalTheme.footer
                                : "bg-white border-border"
                        )}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className={cn(
                                        "text-sm font-medium text-center block uppercase tracking-wider",
                                        isSeasonalDrink && seasonalTheme ? seasonalTheme.label : "text-muted-foreground"
                                    )}>
                                        Who is this drink for?
                                    </label>
                                    <Input
                                        className={cn(
                                            "h-14 text-xl text-center rounded-xl",
                                            isSeasonalDrink && seasonalTheme
                                                ? seasonalTheme.input
                                                : "bg-secondary/30 border-border placeholder:text-muted-foreground/30 focus:border-primary focus:ring-primary/20"
                                        )}
                                        placeholder="Enter your name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        data-1p-ignore
                                        autoComplete="off"
                                        autoCapitalize="words"
                                        inputMode="text"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && customerName.trim()) {
                                                handlePlaceOrder();
                                            }
                                        }}
                                    />
                                </div>

                                <Button
                                    className={cn(
                                        "w-full h-14 text-lg font-semibold transition-all rounded-xl",
                                        isSeasonalDrink && seasonalTheme
                                            ? customerName.trim()
                                                ? seasonalTheme.orderButtonActive
                                                : seasonalTheme.orderButtonInactive
                                            : customerName.trim()
                                                ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                                                : "bg-secondary text-muted-foreground"
                                    )}
                                    onClick={handlePlaceOrder}
                                    disabled={placingOrder || !customerName.trim()}
                                >
                                    {placingOrder ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Ordering...
                                        </>
                                    ) : (
                                        <>
                                            {isSeasonalDrink ? (
                                                <SeasonalIcon className="w-5 h-5 mr-2" />
                                            ) : (
                                                <Martini className="w-5 h-5 mr-2" />
                                            )}
                                            Place Order
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
