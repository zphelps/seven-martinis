import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: orders, error } = await supabase
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
            `);

        console.log(orders);

        if (error) {
            console.log(error);
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 400 });
        }

        // Transform the data to match the desired response structure
        const formattedOrders = orders.map(order => ({
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
                recipe: item.menu_items.recipe
            }))
        }));

        return NextResponse.json(formattedOrders, { status: 200 });
    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 400 });
    }
}