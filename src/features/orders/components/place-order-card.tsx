import { CheckCircleIcon, Router } from "lucide-react";
import { MenuItemsCombobox } from "@/features/menu/components/menu-items-combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderItem } from "@/types/order";
import { useState } from "react";
import { MenuItem } from "@/types/order";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useMenu from "@/features/menu/hooks/use-menu";
import { useUid } from "../hooks/use-uid";
import { useRouter } from "next/navigation";


export function PlaceOrderCard() {
    const { uid, setUid } = useUid();
    const { menuItems, loading: menuItemsLoading, error: menuItemsError } = useMenu({ onlyAvailable: true });
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const [customerName, setCustomerName] = useState<string>("");
    const [placingOrder, setPlacingOrder] = useState<boolean>(false);

    const router = useRouter();

    const handlePlaceOrder = async () => {
        setPlacingOrder(true)

        // validate inputs
        if (!selectedMenuItem || !customerName) {
            setPlacingOrder(false)
            toast({
                title: "Please select a drink and enter your name",
                variant: "destructive",
            });
            return
        }

        const orderItems: OrderItem[] = [{
            menu_item_id: selectedMenuItem.id,
            quantity: 1
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
            // setUid(uid);
            setSelectedMenuItem(null)
            setCustomerName("")
            setPlacingOrder(false);
        }
    }

    return (
        <div className="border border-gray-200 shadow-md bg-white rounded-lg p-4 mx-3 my-4">
            <div className="">
                <p className="font-bold text-lg">
                    Place Order
                </p>
                <p className="text text-gray-500 mb-2">
                    Please enter your name and select a drink from the menu below.
                </p>
            </div>

            <div className="mb-4">
                <Label className="text-sm">
                    Name
                </Label>
                <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-base block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-500"
                    placeholder="Enter your name"
                />
            </div>

            <MenuItemsCombobox
                menuItems={menuItems}
                selectedMenuItem={selectedMenuItem}
                setSelectedMenuItem={setSelectedMenuItem}
            />

            {selectedMenuItem && customerName && (
                <div className="pt-3">
                    <Button className="w-full" onClick={handlePlaceOrder} disabled={placingOrder}>
                        {placingOrder ?
                            <Loader2 className="mr-2 size-5 animate-spin" />
                            :
                            <CheckCircleIcon className="mr-2 size-5" />
                        }
                        Place Order
                    </Button>
                </div>
            )}
        </div>
    )
}