import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = createClient();

    const { error } = await supabase
        .from("menu_item_tags")
        .delete()
        .eq("tag_id", id);

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    return NextResponse.json({
        success: true,
        message: "Tag removed from all drinks"
    }, { status: 200 })
}
