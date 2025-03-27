import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderAccordion } from "@/features/orders/components/order-accordion";
import { useRecipe } from "@/features/recipe/hooks/use-recipe";
import { Order } from "@/types/order";
import { Check, Loader2, X } from "lucide-react";

interface OrderDetailsCardProps {
    order: any;
    onMarkReady: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export const OrderDetailsCard = ({ order, onMarkReady, onClose, isLoading }: OrderDetailsCardProps) => {
    return (
        <div className="w-1/2 min-h-full h-full items-center justify-center bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Serving</p>
                    <p className="text-lg font-bold">
                        {order.customer_name}
                    </p>
                </div>

                <div className="flex items-center space-x-1">
                    <Button
                        variant="outline"
                        onClick={onMarkReady}
                        disabled={isLoading || order.status === "ready"}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        {isLoading ? "Marking Ready..." : "Mark Ready"}

                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <Separator className="mt-2 mb-0.5" />
            <OrderAccordion order={order} />
        </div>
    )
}