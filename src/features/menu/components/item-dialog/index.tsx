"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MenuItem } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Martini, Heart, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderItem } from "@/types/order";
import { useUid } from "@/features/orders/hooks/use-uid";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { config } from "@/config";
import { cn } from "@/lib/utils";

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
        setOpen(isOpen);
        if (!isOpen) {
            setTimeout(() => {
                setCustomerName("");
                setShowSuccess(false);
                setShowTipPrompt(false);
            }, 300);
        }
    }

    const handleTip = () => {
        window.open(config.features.tipUrl, '_blank');
        handleClose();
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-full sm:max-w-md p-0 border-l border-border bg-background"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Order {menuItem.name}</SheetTitle>
                </SheetHeader>

                {/* Success State */}
                {showSuccess && (
                    <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-6 animate-fade-in pb-20">
                        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200">
                            <CheckCircle2 className="w-14 h-14 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-serif font-semibold text-foreground">Order Placed!</h2>
                            <p className="text-xl text-muted-foreground">
                                We&apos;re crafting your drink, {customerName}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tip Prompt */}
                {showTipPrompt && (
                    <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-8 animate-fade-in pb-20">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30">
                            <Heart className="w-10 h-10 text-accent" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-serif font-semibold text-foreground">Support the Bartender</h2>
                            <p className="text-muted-foreground text-lg">
                                Your generosity keeps the craft alive
                            </p>
                        </div>
                        <div className="flex flex-col w-full max-w-xs gap-4">
                            <Button
                                size="lg"
                                className="w-full h-16 text-lg font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
                                onClick={handleTip}
                            >
                                <Heart className="w-5 h-5 mr-2" />
                                Leave a Tip
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full h-12 text-muted-foreground hover:text-foreground"
                                onClick={handleClose}
                            >
                                Skip for now
                            </Button>
                        </div>
                    </div>
                )}

                {/* Order Form */}
                {!showSuccess && !showTipPrompt && (
                    <div className="flex flex-col h-full bg-background">
                        {/* Scrollable content area */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center p-6 space-y-6 pt-12 pb-8">
                                {/* Drink Info */}
                                <div className="text-center space-y-4 max-w-md mx-auto">
                                    <Badge variant="outline" className="border-border text-muted-foreground">
                                        #{menuItem.drink_number}
                                    </Badge>
                                    <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight">
                                        {menuItem.name}
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {menuItem.description}
                                    </p>

                                    {menuItem.tags && menuItem.tags.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                                            {menuItem.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="py-1.5 px-3 bg-white border border-border text-foreground"
                                                >
                                                    <Image
                                                        src={`/${tag.toLowerCase()}.png`}
                                                        className="mr-1.5 h-4 w-auto opacity-80"
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

                        {/* Fixed bottom section */}
                        <div className="flex-shrink-0 p-6 pb-safe bg-white border-t border-border space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground text-center block uppercase tracking-wider">
                                    Who is this drink for?
                                </label>
                                <Input
                                    className="h-14 text-xl text-center bg-secondary/30 border-border placeholder:text-muted-foreground/30 focus:border-primary focus:ring-primary/20 rounded-xl"
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
                                    customerName.trim()
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
                                        <Martini className="w-5 h-5 mr-2" />
                                        Place Order
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
