import { CheckCircleIcon } from "lucide-react";
import { MenuItemsCombobox } from "@/features/menu/components/menu-items-combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderItem } from "@/types/order";
import { useState } from "react";
import { MenuItem } from "@/types/order";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PlaceOrderCardProps {
    menuItems: MenuItem[];
    uid: string | null;
}

export function PlaceOrderCard({ menuItems, uid }: PlaceOrderCardProps) {

    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const [customerName, setCustomerName] = useState<string>("");
    const [placingOrder, setPlacingOrder] = useState<boolean>(false);

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
            customer_name: customerName,
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
        <div className="border border-gray-200 shadow-md bg-white rounded-md p-3 mx-2 my-4">
            <div className="">
                <p className="font-bold">
                    Place Order
                </p>
                <p className="text-sm text-gray-500 mb-2">
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-500"
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