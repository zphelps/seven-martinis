import { NextResponse } from "next/server"

import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("inventory")
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
        console.log("Error in GET /api/inventory", e);
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

        // Extract form fields
        const name = formData.get("name") as string
        const type = formData.get("type") as string
        const stock = formData.get("stock") as string
        const imageFile = formData.get("image") as File | null

        let image_url = ""

        // If an image was uploaded, upload it to Supabase Storage
        if (imageFile && imageFile.size > 0) {
            const fileName = `${Date.now()}-${name}.${imageFile.type}`
            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("inventory_images")
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

            // Construct a public URL or store it if your bucket is public
            const { data: publicUrlData } = supabase
                .storage
                .from("inventory_images")
                .getPublicUrl(fileName)
            image_url = publicUrlData?.publicUrl || ""
        }

        // Insert into the inventory table
        const { data: insertedData, error: dbError } = await supabase
            .from("inventory")
            .insert({
                name,
                type,
                stock,
                image_url,
            })
            .select("*") // Select the inserted row to return it

        if (dbError) {
            console.log(dbError)
            return NextResponse.json({
                success: false,
                error: dbError.message,
            }, { status: 400 })
        }

        return NextResponse.json({ success: true, data: insertedData[0] }, { status: 201 })
    } catch (e) {
        console.error("Error in POST /api/inventory", e)
        return NextResponse.json({
            success: false,
            error: e
        }, { status: 400 })
    }
}