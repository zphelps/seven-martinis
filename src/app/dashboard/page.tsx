"use client"
import React, { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import UserAvatarButton from "@/components/user-avatar-button";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { Board } from "@caldwell619/react-kanban";
import "@caldwell619/react-kanban/dist/styles.css";
import { Order } from "@/types/order";
import { toast } from "@/components/ui/use-toast";
import OrderKanbanCard from "@/features/orders/components/order-card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { styled } from '@mui/material'
import { useSidebar } from "@/components/ui/sidebar";
import { OrderDetailsCard } from "@/features/menu/components/order-details-card";
import { useOrder } from "@/features/orders/hooks/use-order";
export default function Dashboard() {
    const { orders, setOrders, loading, error } = useOrders();
    const [isClearingServed, setIsClearingServed] = useState(false);
    const [isMarkingReady, setIsMarkingReady] = useState(false);
    const [isStartingPreparing, setIsStartingPreparing] = useState(false);

    const [leftOrder, setLeftOrder] = useState<Order | null>(null);
    const [rightOrder, setRightOrder] = useState<Order | null>(null);

    const { updateOrder: updateLeftOrder } = useOrder({
        id: leftOrder?.id || null,
        onUpdate: (updatedOrder) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));
        }
    });

    const { updateOrder: updateRightOrder } = useOrder({
        id: rightOrder?.id || null,
        onUpdate: (updatedOrder) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));
        }
    });

    const { open, toggleSidebar } = useSidebar();

    function handleOrderClick(order: Order) {
        // If the order is already open on either side, don't open it again
        if (leftOrder?.id === order.id || rightOrder?.id === order.id) {
            return;
        }

        if (leftOrder) {
            setRightOrder(order);
        } else {
            setLeftOrder(order);
        }

        if (open) {
            toggleSidebar();
        }
    }

    async function handleMarkReady(order: Order) {
        try {
            setIsMarkingReady(true);

            if (leftOrder?.id === order.id) {
                await updateLeftOrder({ id: order.id, status: "ready" });
                setLeftOrder(null);
            } else if (rightOrder?.id === order.id) {
                await updateRightOrder({ id: order.id, status: "ready" });
                setRightOrder(null);
            }
        } catch (error) {
            // Error handling is done in the useOrder hook
            console.error('Error marking order as ready:', error);
        } finally {
            setIsMarkingReady(false);
        }
    }

    async function handleStartPreparing(order: Order) {
        try {
            setIsStartingPreparing(true);
            if (leftOrder?.id === order.id) {
                await updateLeftOrder({ id: order.id, status: "preparing" });
                setLeftOrder(null);
            } else if (rightOrder?.id === order.id) {
                await updateRightOrder({ id: order.id, status: "preparing" });
                setRightOrder(null);
            }
        } catch (error) {
            // Error handling is done in the useOrder hook
            console.error('Error starting preparation:', error);
        } finally {
            setIsStartingPreparing(false);
        }
    }

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        )
    }
    if (error) return <p>Error fetching orders</p>;

    return (
        <div className="container-lg mx-3 mb-2.5 space-y-4">


            {/* Kanban Board */}
            <div className="flex flex-col justify-center">
                <div className="sticky top-0 pt-2.5 bg-white">
                    <div className="flex justify-center z-1 w-full space-x-2.5">
                        {leftOrder && (
                            <OrderDetailsCard
                                order={leftOrder}
                                onStartPreparing={() => handleStartPreparing(leftOrder)}
                                onMarkReady={() => handleMarkReady(leftOrder)}
                                onClose={() => setLeftOrder(null)}
                                isLoading={isMarkingReady || isStartingPreparing}
                            />
                        )}
                        {rightOrder && (
                            <OrderDetailsCard
                                order={rightOrder}
                                onStartPreparing={() => handleStartPreparing(rightOrder)}
                                onMarkReady={() => handleMarkReady(rightOrder)}
                                onClose={() => setRightOrder(null)}
                                isLoading={isMarkingReady || isStartingPreparing}
                            />
                        )}
                    </div>

                    {(leftOrder || rightOrder) && <Separator className="mt-2.5" />}
                </div>


                <div className="flex justify-center">
                    <KanbanStyles>
                        <Board
                            children={board}
                            disableColumnDrag
                            allowAddCard={false}
                            renderColumnHeader={(column: any) => {
                                return (
                                    <div className="w-[290px] flex items-center justify-between">
                                        <p className=" text-lg font-bold mb-2">
                                            {column.title}
                                        </p>
                                        {/* {column.id === 4 && (
                                            <Button variant="outline" onClick={handleClearServed} disabled={isClearingServed}>
                                                {isClearingServed ? <Loader2 className="w-4 h-4 animate-spin" /> : "Clear"}
                                            </Button>
                                        )} */}
                                    </div>
                                );
                            }}
                            onCardDragEnd={handleCardDragEnd}
                            renderCard={(card) => {
                                return <OrderKanbanCard
                                    order={card}
                                    onClick={handleOrderClick}
                                />;
                            }}
                        />
                    </KanbanStyles>
                </div>
            </div>
        </div >
    );
}

const KanbanStyles = styled('div')`
  & .react-kanban-column {
    border-radius: 8px;
    background-color: #f3f4f6;
  }
`