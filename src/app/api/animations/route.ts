import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("animation_registry")
        .select("*")
        .order("name", { ascending: true });

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
