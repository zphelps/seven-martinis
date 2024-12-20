"use client"
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import UserAvatarButton from "@/components/user-avatar-button";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { Board } from "@caldwell619/react-kanban";
import "@caldwell619/react-kanban/dist/styles.css";
import { Order } from "@/types/order";
import { toast } from "@/components/ui/use-toast";
import OrderCard from "@/features/orders/components/order-card";

export default function Dashboard() {
    const { user } = useAuth();
    const { orders, loading, error } = useOrders();

    if (loading) return <p>Loading orders...</p>;
    if (error)
        return (
            <p>
                Error fetching orders
            </p>
        );

    // Prepare the board data
    const board = {
        columns: [
            {
                id: 1,
                title: "🍺 Ordered",
                value: "ordered",
                cards: orders
                    .filter((order: Order) => order.status === "ordered")
                // .map((order: Order) => ({ id: order.id, ...order })),
            },
            {
                id: 2,
                title: "⏳ Preparing",
                value: "preparing",
                cards: orders
                    .filter((order: Order) => order.status === "preparing")
                // .map((order: Order) => ({ id: order.id, ...order })),
            },
            {
                id: 3,
                title: "✅ Ready",
                value: "ready",
                cards: orders
                    .filter((order: Order) => order.status === "ready")
                // .map((order: Order) => ({ id: order.id, ...order })),
            },
        ],
    };

    async function handleCardDragEnd(board: any, card: any, source: any, destination: any) {
        console.log(board, card, source, destination);

        const newStatus = board.columns[destination.toColumnId - 1].value;

        console.log(newStatus);

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
                // Show success toast
                toast({
                    title: "Order status updated successfully",
                });
            } else {
                // Show error toast
                toast({
                    title: `Error updating order status: ${result.error}`,
                });
            }
        } catch (error: any) {
            // Show error toast
            toast({
                title: `Error updating order status: ${error.message}`,
            });
        }
    }

    return (
        <div className="container mx-auto my-10 space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <p className="font-bold text-4xl">🍸 Seven Martinis</p>
                    <p className="text-gray-400 text-xl">
                        Here are your current orders
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <UserAvatarButton />
                </div>
            </div>
            {/* Kanban Board */}
            <Board
                initialBoard={board}
                disableColumnDrag
                renderColumnHeader={(column) => {
                    return (
                        <p className="w-[350px] text-lg font-bold mb-2">
                            {column.title}
                        </p>
                    );
                }}
                // @ts-ignore
                onCardDragEnd={handleCardDragEnd}
                renderCard={(card) => {
                    return <OrderCard order={card} />;
                }}
            />
        </div>
    );
}