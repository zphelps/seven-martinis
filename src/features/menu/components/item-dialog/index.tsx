import { MenuItem } from "@/types/order";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderItem } from "@/types/order";
import { useUid } from "@/features/orders/hooks/use-uid";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ItemDialogProps {
    menuItem: MenuItem;
    children: React.ReactNode;
}

export const ItemDialog = ({ menuItem, children }: ItemDialogProps) => {
    const [placingOrder, setPlacingOrder] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [showTipDialog, setShowTipDialog] = useState(false);
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
                setShowTipDialog(true);
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

    const handleTipDialogClose = () => {
        setShowTipDialog(false);
        router.push('/menu?tab=orders');
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="h-full max-w-auto sm:max-w-[425px] sm:h-auto p-0">
                    <DialogHeader className="w-full p-6">
                        {menuItem.tags && menuItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {menuItem.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="py-1.5 px-3 border-gray-200 bg-white"
                                    >
                                        <Image
                                            src={`/${tag.toLowerCase()}.png`}
                                            className="mr-2 h-5 w-auto"
                                            alt={tag}
                                            height={16}
                                            width={16}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <DialogTitle className="text-left w-full">#{menuItem.drink_number}. {menuItem.name}</DialogTitle>
                        <DialogDescription className="text-left w-full">
                            {menuItem.description}
                        </DialogDescription>
                        <div className="w-full space-y-2 border-t pt-2">
                            <Input className="w-full" id="name" placeholder="Enter your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            <Button className="w-full" type="submit" onClick={handlePlaceOrder} disabled={placingOrder}>
                                {placingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                                {placingOrder ? "Placing Order..." : "Place Order"}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog open={showTipDialog} onOpenChange={handleTipDialogClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500" />
                            Support the Bartender
                        </DialogTitle>
                        <DialogDescription>
                            If you enjoyed your drink, consider leaving a tip for the bartender. Your generosity helps keep the craft alive!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" size="lg" onClick={handleTipDialogClose}>
                                Skip
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => {
                                    window.open('https://venmo.com/caylan-fields?note=Seven%20Martinis%20(TIP)%20%F0%9F%8D%B8', '_blank');
                                    handleTipDialogClose();
                                }}
                            >
                                Leave a Tip
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}