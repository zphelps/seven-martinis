"use client";

import { Badge } from "@/components/ui/badge"
import { Order } from "@/types/order"
import { Separator } from "@/components/ui/separator"
import { CircleUserRound, Clock, CheckCircle2, Loader2, Star } from "lucide-react"
import { CancelOrderButton } from "./cancel-order-button"
import { StarRating } from "./star-rating"
import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction } from "react"

interface OrderStatusCardProps {
    order: Order,
    setOrders: Dispatch<SetStateAction<Order[]>>
}

const statusConfig = {
    ordered: {
        icon: Clock,
        label: "Ordered",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
        message: "Your order is in the queue."
    },
    preparing: {
        icon: Loader2,
        label: "Preparing",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        message: "Your drink is being crafted."
    },
    ready: {
        icon: CheckCircle2,
        label: "Ready",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        message: "Your order is ready! Pick it up at the bar."
    },
    served: {
        icon: Star,
        label: "Served",
        bgColor: "bg-primary/5",
        textColor: "text-primary",
        borderColor: "border-primary/20",
        message: "How was your drink?"
    }
}

export function OrderStatusCard({ order, setOrders }: OrderStatusCardProps) {
    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.ordered;
    const StatusIcon = status.icon;

    return (
        <div className={cn(
            "bg-white border rounded-lg transition-all overflow-hidden",
            status.borderColor
        )}>
            {/* Header */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="outline"
                            className={cn(
                                "border-0 font-medium",
                                status.bgColor,
                                status.textColor
                            )}
                        >
                            <StatusIcon className={cn(
                                "w-3 h-3 mr-1.5",
                                order.status === 'preparing' && "animate-spin"
                            )} />
                            {status.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary/70 text-secondary-foreground font-normal">
                            <CircleUserRound className="w-3 h-3 mr-1.5" />
                            {order.customer_name}
                        </Badge>
                    </div>
                    {order.status === 'ordered' && (
                        <CancelOrderButton orderId={order.id} setOrders={setOrders} />
                    )}
                </div>

                {/* Drink names */}
                <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
                        {order.items.map((item: any) => item.name).join(", ")}
                    </h3>
                </div>
            </div>

            {/* Status message */}
            <div className={cn("px-4 py-3", status.bgColor)}>
                <p className={cn("text-sm font-medium", status.textColor)}>
                    {status.message}
                </p>
            </div>

            {/* Rating section for served orders */}
            {order.status === 'served' && (
                <div className="p-4 space-y-3 border-t border-border">
                    <StarRating orderId={order.id} />
                    <Separator />
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                            Order Details
                        </p>
                        {order.items.map((item: any, index: number) => (
                            <div key={index} className="text-sm text-foreground flex justify-between items-center">
                                <span>{item.name}</span>
                                <span className="font-mono text-xs text-muted-foreground">×{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
