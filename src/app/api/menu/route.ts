

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("menu_items")
            .select("*");

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
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            success: false,
            error: e
        }, { status: 400 })
    }
}
