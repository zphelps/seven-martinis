import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { OrderItem } from "@/types/order";

export async function GET(request: NextRequest) {
    try {
        const uid = request.nextUrl.searchParams.get('uid');
        const supabase = createClient();

        let query = supabase.from('orders').select(`
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

        if (uid) {
            query = query.eq('uid', uid)
        }

        const { data: orders, error } = await query;
        console.log(orders)

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

export async function POST(request: NextRequest) {
    const { customer_name, items, uid } = await request.json();
    console.log(customer_name, items, uid)

    const supabase = createClient();
    const { data, error } = await supabase
        .from('orders')
        .insert({ customer_name, uid })
        .select();

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 });
    }

    const orderItems = items.map((item: OrderItem) => ({
        order_id: data[0].id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity
    }));

    const { data: order_items, error: order_items_error } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

    if (order_items_error) {
        console.log(order_items_error);
        return NextResponse.json({
            success: false,
            error: order_items_error.message
        }, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        message: "Order placed successfully"
    }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const { orderId } = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase.from('orders').delete().eq('id', orderId);

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        message: "Order cancelled successfully"
    }, { status: 200 });
}