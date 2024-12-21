import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";

interface CancelOrderButtonProps {
    orderId: string;
    setOrders: (orders: Order[]) => void;
}

export function CancelOrderButton({ orderId, setOrders }: CancelOrderButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const handleCancelOrder = async () => {
        setIsLoading(true);
        const response = await fetch('/api/orders', {
            method: 'DELETE',
            body: JSON.stringify({ orderId })
        });

        if (response.ok) {
            // @ts-ignore
            setOrders((prevOrders: Order[]) => prevOrders.filter((order: Order) => order.id !== orderId));
            toast({
                title: "Order cancelled successfully",
                variant: "default"
            });
        } else {
            toast({
                title: "Failed to cancel order",
                variant: "destructive"
            });
        }
        setIsLoading(false);
        setOpen(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="p-0 w-6 h-6">
                    <X className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelOrder} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}