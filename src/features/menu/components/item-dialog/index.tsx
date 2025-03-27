import { MenuItem } from "@/types/order";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderItem } from "@/types/order";
import { useUid } from "@/features/orders/hooks/use-uid";

interface ItemDialogProps {
    menuItem: MenuItem;
    children: React.ReactNode;
}

export const ItemDialog = ({ menuItem, children }: ItemDialogProps) => {
    const [placingOrder, setPlacingOrder] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const { uid } = useUid();
    const router = useRouter();

    const handlePlaceOrder = async () => {
        setPlacingOrder(true)

        // validate inputs
        if (!menuItem || !customerName) {
            setPlacingOrder(false)
            toast({
                title: "Please select a drink and enter your name",
                variant: "destructive",
            });
            return
        }

        const orderItems: OrderItem[] = [{
            menu_item_id: menuItem.id,
            quantity: 1,
            name: menuItem.name,
            instructions: "",
            recipe: menuItem.recipe
        }]

        const order = {
            uid,
            customer_name: customerName.trim(),
            items: orderItems
        }

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify(order),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                toast({
                    title: `Order placed successfully for ${customerName}!`,
                    variant: "default",
                });
                router.push('/menu?tab=orders');
            } else {
                toast({
                    title: "Failed to place order",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "An error occurred while placing your order",
                variant: "destructive",
            });
        } finally {
            setCustomerName("")
            setPlacingOrder(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="h-auto max-w-auto sm:max-w-[425px] sm:h-auto">
                <DialogHeader>
                    <DialogTitle>#{menuItem.drink_number}. {menuItem.name}</DialogTitle>
                    <DialogDescription>
                        {menuItem.description}
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <DialogFooter>
                    <Input id="name" placeholder="Enter your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <Button type="submit" onClick={handlePlaceOrder} disabled={placingOrder}>
                        {placingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                        {placingOrder ? "Placing Order..." : "Place Order"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}