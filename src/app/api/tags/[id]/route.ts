import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = createClient()
        const { id } = params
        const formData = await request.formData()

        const name = formData.get("name") as string | null
        const isFeatured = formData.get("is_featured")
        const isActive = formData.get("is_active")
        const imageFile = formData.get("image") as File | null
        const theme = formData.get("theme") as string | null
        const icon = formData.get("icon") as string | null
        const tagline = formData.get("tagline") as string | null

        const update: {
            name?: string
            is_featured?: boolean
            is_active?: boolean
            image_url?: string
            theme?: string
            icon?: string | null
            tagline?: string | null
        } = {}

        if (name) update.name = name
        if (isFeatured !== null) update.is_featured = isFeatured === "true"
        if (isActive !== null) update.is_active = isActive === "true"
        if (theme !== null) update.theme = theme
        if (icon !== null) update.icon = icon || null
        if (tagline !== null) update.tagline = tagline || null

        if (imageFile && imageFile.size > 0) {
            const fileName = `${Date.now()}-${name ?? id}.${imageFile.type}`
            const { error: uploadError } = await supabase.storage
                .from("tag_images")
                .upload(fileName, imageFile, {
                    upsert: false,
                })

            if (uploadError) {
                console.log("Error uploading image: ", uploadError)
                return NextResponse.json({
                    success: false,
                    error: uploadError.message,
                }, { status: 400 })
            }

            const { data: publicUrlData } = supabase.storage
                .from("tag_images")
                .getPublicUrl(fileName)
            update.image_url = publicUrlData?.publicUrl || ""
        }

        const { data, error } = await supabase
            .from("tags")
            .update(update)
            .eq("id", id)
            .select("*")

        if (error) {
            console.log(error);
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            data: data[0]
        }, { status: 200 })
    } catch (e) {
        console.error("Error in PUT /api/tags/[id]", e)
        return NextResponse.json({
            success: false,
            error: e
        }, { status: 400 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = createClient();

    const { error } = await supabase
        .from("tags")
        .delete()
        .eq('id', id);

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 })
    }

    return NextResponse.json({
        success: true,
        message: "Tag deleted successfully"
    }, { status: 200 })
}
