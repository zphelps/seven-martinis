import { Badge } from "@/components/ui/badge"
import { MenuItem, Order, OrderItem } from "@/types/order"
import { Separator } from "@/components/ui/separator"
import { X, UserIcon, CircleUserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CancelOrderButton } from "./cancel-order-button"
import { StarRating } from "./star-rating"

interface OrderStatusCardProps {
    order: Order,
    setOrders: (orders: Order[]) => void
}

export function OrderStatusCard({ order, setOrders }: OrderStatusCardProps) {
    return (
        <div className="p-4 border border-gray-200 bg-white rounded-lg shadow-md space-y-1">

            <div className="flex justify-between">
                <div className="flex gap-1">
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

                    {order.status === 'served' && (
                        <Badge variant="outline" className="mb-2">
                            ⭐️ Served
                        </Badge>
                    )}

                    <Badge variant="outline" className="mb-2">
                        <CircleUserRound className="w-3 h-3 pl-0 ml-0 mr-1" /> {order.customer_name}
                    </Badge>
                </div>

                {order.status === 'ordered' && <CancelOrderButton orderId={order.id} setOrders={setOrders} />}
            </div>


            <p className="font-medium">
                {order.items.map((item: any) => item.name).join(", ")}
                {/* {order.status === 'ordered' && `We've received your order, ${order.customer_name}!`}
                {order.status === 'preparing' && `We're preparing your order, ${order.customer_name}!`}
                {order.status === 'ready' && `Your order is ready, ${order.customer_name}!`}
                {order.status === 'served' && `Thank you for your order, ${order.customer_name}!`} */}
            </p>

            {order.status === 'ordered' && (
                <p className="text-sm text-gray-500">
                    {"We will begin preparing your order shortly."}
                </p>
            )}

            {order.status === 'preparing' && (
                <p className="text-sm text-gray-500">
                    {"Your order is being prepared. Please wait a moment."}
                </p>
            )}

            {order.status === 'ready' && (
                <p className="text-sm text-gray-500">
                    {"Your order is ready. Please pick it up at the counter."}
                </p>
            )}

            {order.status === 'served' && (
                <div>
                    <p className="text-sm text-gray-500">
                        {"We've love to hear how you enjoyed your drink."}
                    </p>
                    <StarRating orderId={order.id} />
                </div>
            )}

            {order.status === 'served' && <div>
                <Separator className="my-2" />
                {order.items.map((item: any, index: number) => (
                    <div key={index} className="text-sm text-gray-500">
                        {item.quantity}x {item.name} (#{item.drink_number})
                    </div>
                ))}
            </div>}
        </div >
    )
}