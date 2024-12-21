"use client"
import React, { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import UserAvatarButton from "@/components/user-avatar-button";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { Board } from "@caldwell619/react-kanban";
import "@caldwell619/react-kanban/dist/styles.css";
import { Order } from "@/types/order";
import { toast } from "@/components/ui/use-toast";
import OrderCard from "@/features/orders/components/order-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const { orders, setOrders, loading, error } = useOrders();
    const [isClearingServed, setIsClearingServed] = useState(false);

    // Compute the board from orders
    const board = useMemo(
        () => ({
            columns: [
                {
                    id: 1,
                    title: "🍺 Ordered",
                    value: "ordered",
                    cards: orders.filter((order: Order) => order.status === "ordered"),
                },
                {
                    id: 2,
                    title: "⏳ Preparing",
                    value: "preparing",
                    cards: orders.filter((order: Order) => order.status === "preparing"),
                },
                {
                    id: 3,
                    title: "✅ Ready",
                    value: "ready",
                    cards: orders.filter((order: Order) => order.status === "ready"),
                },
                {
                    id: 4,
                    title: "👍 Served",
                    value: "served",
                    cards: orders.filter((order: Order) => order.status === "served"),
                },
            ],
        }),
        [orders]
    );

    async function handleClearServed() {
        const servedOrders = orders.filter((order: Order) => order.status === "served");

        if (servedOrders.length === 0) {
            toast({
                title: "No served orders to clear",
            });
            return;
        }

        const deletePromises = servedOrders.map(async (order) => {
            try {
                setIsClearingServed(true);
                const response = await fetch(`/api/orders`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderId: order.id }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete order with id ${order.id}`);
                }

                // Remove the order from the state
                setOrders((prevOrders: any) =>
                    prevOrders.filter((o: any) => o.id !== order.id)
                );

            } catch (error: any) {
                toast({
                    title: `Error deleting order ${order.id}: ${error.message}`,
                    variant: "destructive",
                });
            } finally {
                setIsClearingServed(false);
            }
        });

        await Promise.all(deletePromises);
        toast({
            title: "Served orders cleared successfully",
        });
    }

    async function handleCardDragEnd(card: any, source: any, destination: any) {
        const newStatus = board.columns[destination.toColumnId - 1].value;

        // Find the index of the moved order
        const movedOrderIndex = orders.findIndex((order) => order.id === card.id);
        const oldStatus = orders[movedOrderIndex].status;

        // Optimistically update the orders state
        setOrders((prevOrders: any) =>
            prevOrders.map((order: any) =>
                order.id === card.id ? { ...order, status: newStatus } : order
            )
        );

        try {
            // Update the order status in the backend
            const response = await fetch(`/api/orders/${card.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Order status updated successfully",
                });
            } else {
                // Revert the optimistic update on error
                setOrders((prevOrders: any) =>
                    prevOrders.map((order: any) =>
                        order.id === card.id ? { ...order, status: oldStatus } : order
                    )
                );
                toast({
                    title: `Error updating order status: ${result.error}`,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            // Revert the optimistic update on error
            setOrders((prevOrders: any) =>
                prevOrders.map((order: any) =>
                    order.id === card.id ? { ...order, status: oldStatus } : order
                )
            );
            toast({
                title: `Error updating order status: ${error.message}`,
                variant: "destructive",
            });
        }
    }

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error fetching orders</p>;

    return (
        <div className="container-lg mx-3 my-8 space-y-4">

            {/* Kanban Board */}
            <div className="flex flex-col justify-center">
                {/* <div className="flex items-center justify-between m-2">
                    <div className="space-y-2">
                        <p className="font-bold text-4xl">🍸 Seven Martinis</p>
                        <p className="text-gray-500 text-xl">
                            Here are your current orders
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserAvatarButton />
                    </div>
                </div> */}
                <div className="flex justify-center">
                    <Board
                        children={board}
                        disableColumnDrag
                        allowAddCard={false}
                        renderColumnHeader={(column: any) => {
                            console.log(column);
                            return (
                                <div className="w-[290px] flex items-center justify-between">
                                    <p className=" text-lg font-bold mb-2">
                                        {column.title}
                                    </p>
                                    {column.id === 4 && (
                                        <Button variant="outline" onClick={handleClearServed} disabled={isClearingServed}>
                                            {isClearingServed ? <Loader2 className="w-4 h-4 animate-spin" /> : "Clear"}
                                        </Button>
                                    )}
                                </div>
                            );
                        }}
                        onCardDragEnd={handleCardDragEnd}
                        renderCard={(card) => {
                            return <OrderCard order={card} />;
                        }}
                    />
                </div>

            </div>
        </div >
    );
}