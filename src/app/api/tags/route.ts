import { NextResponse } from "next/server"

import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("tags")
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
    } catch (e) {
        console.log("Error in GET /api/tags", e);
        return NextResponse.json({
            success: false,
            error: e
        }, { status: 400 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const formData = await request.formData()

        const name = formData.get("name") as string
        const isFeatured = formData.get("is_featured") === "true"
        const imageFile = formData.get("image") as File | null

        let image_url = ""

        if (imageFile && imageFile.size > 0) {
            const fileName = `${Date.now()}-${name}.${imageFile.type}`
            const { data: uploadData, error: uploadError } =
                await supabase.storage
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

            const { data: publicUrlData } = supabase
                .storage
                .from("tag_images")
                .getPublicUrl(fileName)
            image_url = publicUrlData?.publicUrl || ""
        }

        const { data: insertedData, error: dbError } = await supabase
            .from("tags")
            .insert({
                name,
                image_url,
                is_featured: isFeatured,
            })
            .select("*")

        if (dbError) {
            console.log(dbError)
            return NextResponse.json({
                success: false,
                error: dbError.message,
            }, { status: 400 })
        }

        return NextResponse.json({ success: true, data: insertedData[0] }, { status: 201 })
    } catch (e) {
        console.error("Error in POST /api/tags", e)
        return NextResponse.json({
            success: false,
            error: e
        }, { status: 400 })
    }
}
