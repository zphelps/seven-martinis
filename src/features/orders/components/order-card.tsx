import { Order } from "@/types/order";
import OrderDialog from "./order-dialog";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    return (
        <OrderDialog order={order}>
            <div key={order.id} className="p-4 w-[350px] bg-white rounded shadow">
                <p className="font-bold">{order.customer_name}</p>
                {order.items.map((item: any) => (
                    <p key={item.id}>
                        {item.quantity}x {item.name} (#{item.drink_number})
                    </p>
                ))}
            </div>
        </OrderDialog>
    );
}