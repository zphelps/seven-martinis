import { Order, OrderStatus } from "@/types/order";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface UpdateOrderProps {
    id: string;
    rating?: number;
    status?: OrderStatus;
}

interface UseOrderProps {
    id: string | null;
    onUpdate?: (order: Order) => void;
}

export function useOrder({ id, onUpdate }: UseOrderProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateOrder = async ({ id, rating, status }: UpdateOrderProps) => {
        setIsLoading(true);
        const previousOrder = order;

        // Optimistically update the local state
        if (status) {
            setOrder(prev => prev ? { ...prev, status } : null);
        }
        if (rating) {
            setOrder(prev => prev ? { ...prev, rating } : null);
        }

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

            // Update the parent component's state if callback provided
            if (onUpdate && data.data) {
                onUpdate(data.data);
            }

            toast({
                title: "Order updated successfully",
                description: status ? `Order marked as ${status}` : "Rating updated",
            });

            return data.data;
        } catch (error: any) {
            // Revert optimistic update on error
            setOrder(previousOrder);

            toast({
                title: "Failed to update order",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const response = await fetch(`/api/orders/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch order');
                }
                setOrder(data.data);
            } catch (error: any) {
                console.error('Error fetching order:', error);
                toast({
                    title: "Failed to fetch order",
                    description: error.message,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    return { order, updateOrder, isLoading };
}