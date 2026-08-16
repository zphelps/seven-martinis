"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { OrderStatus } from '@/types/order'

export interface AnalyticsOrderItem {
    menu_item_id: string
    quantity: number
}

export interface AnalyticsOrder {
    id: string
    created_at: string
    status: OrderStatus
    uid: string | null
    rating: number | null
    items: AnalyticsOrderItem[]
}

export function useOrderAnalytics() {
    const [orders, setOrders] = useState<AnalyticsOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        created_at,
                        status,
                        uid,
                        rating,
                        order_items (
                            menu_item_id,
                            quantity
                        )
                    `)
                    .order('created_at', { ascending: true })

                if (error) throw error

                const formatted = (data ?? []).map((order: any) => ({
                    id: order.id,
                    created_at: order.created_at,
                    status: order.status,
                    uid: order.uid,
                    rating: order.rating,
                    items: (order.order_items ?? []).map((item: any) => ({
                        menu_item_id: item.menu_item_id,
                        quantity: item.quantity,
                    })),
                }))

                setOrders(formatted as AnalyticsOrder[])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()

        const channel = supabase
            .channel('public:orders-analytics')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => fetchOrders()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'order_items' },
                () => fetchOrders()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { orders, loading, error }
}
