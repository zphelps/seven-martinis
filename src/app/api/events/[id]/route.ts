import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = createClient();

    const { data: event, error } = await supabase.from("events").select("*").eq("id", id).single();

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    const { data: details, error: detailsError } = await supabase
        .from("event_detail_items")
        .select("*")
        .eq("event_id", id)
        .order("sort_order", { ascending: true });

    if (detailsError) {
        console.log(detailsError);
        return NextResponse.json({
            success: false,
            error: detailsError.message
        }, { status: 400 })
    }

    return NextResponse.json({
        data: { event, details },
        success: true,
    }, { status: 200 })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json();
    const { details, ...eventFields } = body;
    const supabase = createClient();

    const { data: event, error } = await supabase
        .from("events")
        .update(eventFields)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    if (Array.isArray(details)) {
        const { error: deleteError } = await supabase.from("event_detail_items").delete().eq("event_id", id);

        if (deleteError) {
            console.log(deleteError);
            return NextResponse.json({
                success: false,
                error: deleteError.message
            }, { status: 400 })
        }

        if (details.length > 0) {
            const { error: insertError } = await supabase
                .from("event_detail_items")
                .insert(details.map((detail: any, index: number) => ({
                    event_id: id,
                    key: detail.key,
                    value: detail.value,
                    sort_order: detail.sort_order ?? index,
                })));

            if (insertError) {
                console.log(insertError);
                return NextResponse.json({
                    success: false,
                    error: insertError.message
                }, { status: 400 })
            }
        }
    }

    return NextResponse.json({
        data: event,
        success: true,
    }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = createClient();

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    return NextResponse.json({
        success: true,
        message: "Invitation deleted successfully"
    }, { status: 200 })
}
