"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, XCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Order } from "@/types/order";

interface CancelOrderButtonProps {
    orderId: string;
    setOrders: Dispatch<SetStateAction<Order[]>>;
}

export function CancelOrderButton({ orderId, setOrders }: CancelOrderButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCancelOrder = async () => {
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/orders', {
                method: 'DELETE',
                body: JSON.stringify({ orderId })
            });

            if (response.ok) {
                setOrders((prevOrders: Order[]) => prevOrders.filter((order: Order) => order.id !== orderId));
                toast({
                    title: "Order cancelled",
                    description: "Your order has been successfully cancelled.",
                });
                setOpen(false);
            } else {
                toast({
                    title: "Failed to cancel order",
                    description: "Please try again or contact support.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive h-8 px-3"
                >
                    Cancel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        Cancel Order?
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Keep Order
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancelOrder}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            "Cancel Order"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
