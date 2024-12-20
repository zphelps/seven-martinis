import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: { order_id: string } }
) {
    const { order_id } = params;
    const supabase = createClient();

    try {
        const { status } = await request.json();

        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", order_id);

        if (error) {
            console.error(error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 400 }
        );
    }
}