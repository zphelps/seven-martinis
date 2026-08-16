"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MenuItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Martini, Heart, CheckCircle2, Tag as TagIcon, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { OrderItem } from "@/types/order";
import { useUid } from "@/features/orders/hooks/use-uid";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { getFeaturedTheme, resolveFeaturedIcon } from "@/features/tags/lib/featured-themes";

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

    // Drinks with an active, featured tag get that tag's highlighted theme
    const visibleTags = menuItem.tags?.filter((tag) => tag.is_active);
    const featuredTag = visibleTags?.find((tag) => tag.is_featured) ?? null;
    const isFeaturedDrink = !!featuredTag;
    const theme = featuredTag ? getFeaturedTheme(featuredTag.theme) : null;
    const FeaturedIcon = featuredTag ? resolveFeaturedIcon(featuredTag.icon) ?? theme!.defaultIcon : null;

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
                    isFeaturedDrink
                        ? cn(theme!.panelGradientClassName, theme!.panelBorderClassName)
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
                            isFeaturedDrink
                                ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                        )}
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                {/* Decorative icon for featured drinks */}
                {isFeaturedDrink && FeaturedIcon && (
                    <>
                        <div className="absolute top-20 right-8 opacity-10 pointer-events-none">
                            <FeaturedIcon className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute bottom-32 left-6 opacity-10 pointer-events-none">
                            <FeaturedIcon className="w-20 h-20 text-white" />
                        </div>
                        <div className="absolute top-1/3 right-1/4 opacity-5 pointer-events-none">
                            <FeaturedIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute top-1/2 left-8 opacity-5 pointer-events-none">
                            <FeaturedIcon className="w-8 h-8 text-white" />
                        </div>
                    </>
                )}

                {/* Success State */}
                {showSuccess && (
                    <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-6 animate-fade-in pb-20 relative z-10">
                        <div className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center border-2",
                            isFeaturedDrink
                                ? theme!.circleIconBoxClassName
                                : "bg-green-50 border-green-200"
                        )}>
                            <CheckCircle2 className={cn(
                                "w-14 h-14",
                                isFeaturedDrink ? theme!.circleIconTextClassName : "text-green-600"
                            )} />
                        </div>
                        <div className="space-y-2">
                            <h2 className={cn(
                                "text-3xl font-serif font-semibold",
                                isFeaturedDrink ? "text-white" : "text-foreground"
                            )}>Order Placed!</h2>
                            <p className={cn(
                                "text-xl",
                                isFeaturedDrink ? theme!.subheadingClassName : "text-muted-foreground"
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
                            isFeaturedDrink
                                ? theme!.circleIconBoxClassName
                                : "bg-accent/10 border-accent/30"
                        )}>
                            <Heart className={cn(
                                "w-10 h-10",
                                isFeaturedDrink ? theme!.circleIconTextClassName : "text-accent"
                            )} />
                        </div>
                        <div className="space-y-3">
                            <h2 className={cn(
                                "text-2xl font-serif font-semibold",
                                isFeaturedDrink ? "text-white" : "text-foreground"
                            )}>Support the Bartender</h2>
                            <p className={cn(
                                "text-lg",
                                isFeaturedDrink ? theme!.subheadingClassName : "text-muted-foreground"
                            )}>
                                Your generosity keeps the craft alive
                            </p>
                        </div>
                        <div className="flex flex-col w-full max-w-xs gap-4">
                            <Button
                                size="lg"
                                className={cn(
                                    "w-full h-16 text-lg font-medium",
                                    isFeaturedDrink
                                        ? cn(theme!.buttonClassName, "text-white")
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
                                    isFeaturedDrink
                                        ? theme!.skipTextClassName
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
                                            isFeaturedDrink
                                                ? theme!.numberOutlineBadgeClassName
                                                : "border-border text-muted-foreground"
                                        )}
                                    >
                                        #{menuItem.drink_number}
                                    </Badge>
                                    <h2 className={cn(
                                        "text-3xl md:text-4xl font-serif font-semibold leading-tight",
                                        isFeaturedDrink ? "text-white" : "text-foreground"
                                    )}>
                                        {menuItem.name}
                                    </h2>
                                    <p className={cn(
                                        "text-lg leading-relaxed",
                                        isFeaturedDrink ? theme!.bodyMutedClassName : "text-muted-foreground"
                                    )}>
                                        {menuItem.description}
                                    </p>

                                    {visibleTags && visibleTags.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                                            {visibleTags.map((tag) => (
                                                <Badge
                                                    key={tag.id}
                                                    variant="secondary"
                                                    className={cn(
                                                        "py-1.5 px-3",
                                                        isFeaturedDrink
                                                            ? theme!.tagChipClassName
                                                            : "bg-white border border-border text-foreground"
                                                    )}
                                                >
                                                    {tag.image_url ? (
                                                        <Image
                                                            src={tag.image_url}
                                                            className={cn(
                                                                "mr-1.5 h-4 w-auto",
                                                                isFeaturedDrink ? "opacity-90" : "opacity-80"
                                                            )}
                                                            alt={tag.name}
                                                            height={16}
                                                            width={16}
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    ) : (
                                                        <TagIcon className="mr-1.5 h-4 w-4 opacity-80" />
                                                    )}
                                                    <span className="text-xs">{tag.name}</span>
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
                            isFeaturedDrink
                                ? cn("bg-black/40 backdrop-blur-sm", theme!.panelBorderClassName)
                                : "bg-white border-border"
                        )}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className={cn(
                                        "text-sm font-medium text-center block uppercase tracking-wider",
                                        isFeaturedDrink ? theme!.subheadingClassName : "text-muted-foreground"
                                    )}>
                                        Who is this drink for?
                                    </label>
                                    <Input
                                        className={cn(
                                            "h-14 text-xl text-center rounded-xl",
                                            isFeaturedDrink
                                                ? theme!.inputClassName
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
                                        isFeaturedDrink
                                            ? customerName.trim()
                                                ? cn(theme!.buttonClassName, "text-white shadow-lg")
                                                : theme!.buttonDisabledClassName
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
                                            {isFeaturedDrink && FeaturedIcon ? (
                                                <FeaturedIcon className="w-5 h-5 mr-2" />
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
