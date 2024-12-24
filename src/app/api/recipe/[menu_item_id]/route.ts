
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { menu_item_id: string } }) {
    const { menu_item_id } = params

    const supabase = createClient()

    const { data: ingredients, error } = await supabase
        .from('ingredients')
        .select('*, inventory_item:inventory_item_id(*)')
        .eq('menu_item_id', menu_item_id)

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const recipe = { menu_item_id, ingredients }

    return NextResponse.json({ data: recipe, success: true })
}

export async function POST(request: Request, { params }: { params: { menu_item_id: string } }) {
    const { menu_item_id } = params

    const supabase = createClient()
    const ingredient = await request.json()

    const { data: ingredients, error } = await supabase
        .from('ingredients')
        .insert(ingredient)
        .eq('menu_item_id', menu_item_id)
        .select("*, inventory_item:inventory_item_id(*)")

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: ingredients[0], success: true })
}