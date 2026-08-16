import { randomBytes } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    return NextResponse.json({
        data: data,
        success: true,
    }, { status: 200 })
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { details, ...eventFields } = body;
    const supabase = createClient();

    const token = randomBytes(24).toString("hex");

    const { data: event, error } = await supabase
        .from("events")
        .insert({ ...eventFields, token })
        .select()
        .single();

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    if (Array.isArray(details) && details.length > 0) {
        const { error: detailsError } = await supabase
            .from("event_detail_items")
            .insert(details.map((detail: any, index: number) => ({
                event_id: event.id,
                key: detail.key,
                value: detail.value,
                sort_order: detail.sort_order ?? index,
            })));

        if (detailsError) {
            console.log(detailsError);
            return NextResponse.json({
                success: false,
                error: detailsError.message
            }, { status: 400 })
        }
    }

    return NextResponse.json({
        data: event,
        success: true,
    }, { status: 200 })
}
