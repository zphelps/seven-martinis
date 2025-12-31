import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderAccordion } from "@/features/orders/components/order-accordion";
import { Order, OrderStatus } from "@/types/order";
import { Check, Loader2, X, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsCardProps {
    order: Order;
    onStartPreparing: () => void;
    onMarkReady: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export const OrderDetailsCard = ({ order, onStartPreparing, onMarkReady, onClose, isLoading }: OrderDetailsCardProps) => {
    const getButtonText = (status: OrderStatus) => {
        switch (status) {
            case "ordered":
                return "Start Preparing";
            case "preparing":
                return "Mark Ready";
            case "served":
                return "Served";
            default:
                return "Mark Ready";
        }
    };

    const handleStatusChange = () => {
        if (order.status === "ordered") {
            onStartPreparing();
        } else if (order.status === "preparing") {
            onMarkReady();
        }
    };

    const isButtonDisabled = order.status === "ready" || order.status === "served" || isLoading;

    return (
        <div className="w-1/2 min-h-full h-full bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Serving</p>
                            <p className="text-xl font-serif font-semibold text-foreground">
                                {order.customer_name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleStatusChange}
                        disabled={isButtonDisabled}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Check className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? "Processing..." : getButtonText(order.status)}
                    </Button>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            
            <Separator className="my-3" />
            <OrderAccordion order={order} />
        </div>
    )
}
