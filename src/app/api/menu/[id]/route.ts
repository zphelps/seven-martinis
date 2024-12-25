import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase
        .from("menu_items")
        .update(body)
        .eq('id', id)
        .select();

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    return NextResponse.json({
        success: true,
        data: data
    }, { status: 200 })
}