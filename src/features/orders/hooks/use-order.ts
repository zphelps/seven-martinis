
import { Order } from "@/types/order";
import { useEffect, useState } from "react";

interface UpdateOrderProps {
    id: string;
    rating?: number;
    status?: string;
}

interface UseOrderProps {
    id: string | null;
}

export function useOrder({ id }: UseOrderProps) {
    const [order, setOrder] = useState<Order | null>(null);

    const updateOrder = async ({ id, rating, status }: UpdateOrderProps) => {
        const previousOrder = order;
        setOrder(previousOrder => ({ ...previousOrder, rating, status }) as Order);

        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update order');
            }

            console.log('Order updated successfully');
        } catch (error) {
            console.error('Error updating order:', error);
            setOrder(previousOrder);
        }
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch order');
                }
                setOrder(data.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };
        if (id) {
            fetchOrder();
        }
    }, [id]);

    return { order, updateOrder };
}