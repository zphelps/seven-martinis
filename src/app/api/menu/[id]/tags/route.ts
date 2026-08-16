import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const { tagIds } = await request.json() as { tagIds: string[] };
    const supabase = createClient();

    const { error: deleteError } = await supabase
        .from("menu_item_tags")
        .delete()
        .eq("menu_item_id", id);

    if (deleteError) {
        console.log(deleteError);
        return NextResponse.json({
            success: false,
            error: deleteError.message
        }, { status: 400 })
    }

    if (tagIds.length > 0) {
        const { error: insertError } = await supabase
            .from("menu_item_tags")
            .insert(tagIds.map((tagId) => ({ menu_item_id: id, tag_id: tagId })));

        if (insertError) {
            console.log(insertError);
            return NextResponse.json({
                success: false,
                error: insertError.message
            }, { status: 400 })
        }
    }

    const { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_item_tags(tags(*))")
        .eq("id", id)
        .single();

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    return NextResponse.json({
        success: true,
        data: {
            ...data,
            tags: data.menu_item_tags.map((join: { tags: unknown }) => join.tags),
            menu_item_tags: undefined,
        }
    }, { status: 200 })
}
