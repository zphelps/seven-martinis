import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Order } from '@/types/order';

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const supabase = createClient();

        const fetchOrders = async () => {
            try {
                console.log('fetching orders', new Date().toISOString());
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        customer_name,
                        status,
                        created_at,
                        order_items (
                            menu_item_id,
                            quantity,
                            menu_items (
                                name,
                                description,
                                drink_number,
                                recipe
                            )
                        )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const formattedOrders = data.map((order: any) => ({
                    id: order.id,
                    customer_name: order.customer_name,
                    status: order.status,
                    created_at: order.created_at,
                    items: order.order_items.map((item: any) => ({
                        menu_item_id: item.menu_item_id,
                        name: item.menu_items.name,
                        quantity: item.quantity,
                        description: item.menu_items.description,
                        drink_number: item.menu_items.drink_number,
                        recipe: item.menu_items.recipe,
                    })),
                }));

                setOrders(formattedOrders as Order[]);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        const ordersChannel = supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    console.log(payload);
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ordersChannel);
        };
    }, []);

    return { orders, setOrders, loading, error };
}
