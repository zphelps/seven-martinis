import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { menu_item_id: string, ingredient_id: string } }) {
    const { menu_item_id, ingredient_id } = params
    const { quantity, unit, inventory_item_id, instructions } = await request.json()

    const supabase = createClient()

    console.log(quantity, unit, inventory_item_id)

    const { error } = await supabase
        .from('ingredients')
        .update({ quantity, unit, inventory_item_id, instructions })
        .eq('menu_item_id', menu_item_id)
        .eq('id', ingredient_id)

    if (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(request: Request, { params }: { params: { menu_item_id: string, ingredient_id: string } }) {
    const { menu_item_id, ingredient_id } = params

    const supabase = createClient()

    const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('menu_item_id', menu_item_id)
        .eq('id', ingredient_id)

    if (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}