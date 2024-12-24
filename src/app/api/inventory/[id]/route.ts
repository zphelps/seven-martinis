import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { id } = params
    const { stock } = await request.json()
    const { data, error } = await supabase.from("inventory").update({ stock }).eq("id", id).select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { id } = params
    const { data, error } = await supabase.from("inventory").delete().eq("id", id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
}