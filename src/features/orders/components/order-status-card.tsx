import { Badge } from "@/components/ui/badge"
import { MenuItem, Order, OrderItem } from "@/types/order"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CancelOrderButton } from "./cancel-order-button"

interface OrderStatusCardProps {
    order: Order,
    setOrders: (orders: Order[]) => void
}

export function OrderStatusCard({ order, setOrders }: OrderStatusCardProps) {
    return (
        <div className="p-3 border border-gray-200 bg-white rounded-md shadow-md">

            <div className="flex justify-between">
                {order.status === 'ordered' && (
                    <Badge variant="outline" className="mb-2">
                        🍹 Ordered
                    </Badge>
                )}

                {order.status === 'preparing' && (
                    <Badge variant="outline" className="mb-2">
                        ⏳ Preparing
                    </Badge>
                )}

                {order.status === 'ready' && (
                    <Badge variant="outline" className="mb-2">
                        ✅ Ready
                    </Badge>
                )}

                {order.status === 'ordered' && <CancelOrderButton orderId={order.id} setOrders={setOrders} />}
            </div>

            <p className="font-medium">
                {order.status === 'ordered' && `We've received your order, ${order.customer_name}!`}
                {order.status === 'preparing' && `We're preparing your order, ${order.customer_name}!`}
                {order.status === 'ready' && `Your order is ready, ${order.customer_name}!`}
            </p>

            {order.status === 'ordered' && (
                <p className="text-sm text-gray-500">
                    {"We'll let you know when we begin preparing your order."}
                </p>
            )}

            {order.status === 'preparing' && (
                <p className="text-sm text-gray-500">
                    {"We'll let you know when your order is ready."}
                </p>
            )}

            {order.status === 'ready' && (
                <p className="text-sm text-gray-500">
                    {"Please pick up your order at the counter."}
                </p>
            )}

            <Separator className="my-2" />
            {order.items.map((item: any, index: number) => (
                <div key={index} className="text-sm text-gray-500">
                    {item.quantity}x {item.name} (#{item.drink_number})
                </div>
            ))}
        </div>
    )
}