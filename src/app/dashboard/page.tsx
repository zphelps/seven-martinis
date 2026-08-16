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

        const clearPromises = servedOrders.map(async (order) => {
            try {
                setIsClearingServed(true);
                const response = await fetch(`/api/orders/${order.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ cleared_at: new Date().toISOString() }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to clear order with id ${order.id}`);
                }

                setOrders((prevOrders: any) =>
                    prevOrders.filter((o: any) => o.id !== order.id)
                );

            } catch (error: any) {
                toast({
                    title: `Error clearing order ${order.id}: ${error.message}`,
                    variant: "destructive",
                });
            } finally {
                setIsClearingServed(false);
            }
        });

        await Promise.all(clearPromises);
        toast({
            title: "Served orders cleared successfully",
        });
    }

    async function handleCardDragEnd(card: any, source: any, destination: any) {
        const newStatus = board.columns[destination.toColumnId - 1].value;

        const movedOrderIndex = orders.findIndex((order) => order.id === card.id);
        const oldStatus = orders[movedOrderIndex].status;

        setOrders((prevOrders: any) =>
            prevOrders.map((order: any) =>
                order.id === card.id ? { ...order, status: newStatus } : order
            )
        );

        try {
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
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }
    if (error) return <p className="text-destructive p-4">Error fetching orders</p>;

    return (
        <div className="container-lg mx-0 mb-2.5 h-screen overflow-hidden flex flex-col">
            {/* Order Details Cards */}
            <div className="flex flex-col flex-1 min-h-0">
                <div className="shrink-0 pt-2.5 bg-background">
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

                {/* Kanban Board */}
                <div className="flex justify-center flex-1 min-h-0 overflow-x-auto">
                    <KanbanStyles>
                        <Board
                            children={board}
                            disableColumnDrag
                            allowAddCard={false}
                            renderColumnHeader={(column: any) => {
                                return (
                                    <div className="w-[275px] flex items-center justify-between">
                                        <p className="text-lg font-semibold m-2 text-foreground">
                                            {column.title}
                                        </p>
                                        {column.id === 4 && (
                                            <Button variant="outline" size="sm" onClick={handleClearServed} disabled={isClearingServed}>
                                                {isClearingServed ? <Loader2 className="w-4 h-4 animate-spin" /> : "Clear"}
                                            </Button>
                                        )}
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
  display: flex;
  height: 100%;
  min-height: 0;

  & .react-kanban-board {
    height: 100%;
  }

  /* The board only stretches its direct child (the droppable columns
     wrapper) when align-items would allow it, but react-kanban hardcodes
     align-items: flex-start inline, so that wrapper never gets a real
     height on its own — force it here so the columns' height: 100%
     (also inline, from the library) has something real to resolve against. */
  & .react-kanban-board > div {
    height: 100%;
  }

  & .react-kanban-column {
    border-radius: 12px;
    background-color: hsl(var(--secondary));
    border: 1px solid hsl(var(--border));
    padding: 6px;
    box-sizing: border-box;
    /* react-kanban hardcodes this column's own display as inline-block
       inline, which we override (needs !important to beat the inline
       style) so the header and the card-droppable zone below it stack
       in a column instead of both claiming the same inherited height. */
    display: inline-flex !important;
    flex-direction: column;
  }

  /* The card-droppable zone (react-kanban's second, unclassed child of
     the column) is inline-styled with height: inherit, which copies the
     column's own 100% and, added on top of the header's height, always
     overflows the column by exactly the header's height - even with zero
     cards. Giving it flex-basis 0 ignores that inline height and lets it
     take only the space left after the header, so it can scroll on its
     own when cards overflow instead of the column overflowing them both. */
  & .react-kanban-column > div:last-child {
    flex: 1 1 0 !important;
    min-height: 0 !important;
    overflow-y: auto;
  }
`
