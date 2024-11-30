import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = Object.fromEntries(request.nextUrl.searchParams.entries())

    const schema = z.object({
        uid: z.string(),
    });

    const validationResponse = schema.safeParse(query);
    if (!validationResponse.success) {
        console.log(validationResponse.error.errors);
        return NextResponse.json({
            success: false,
            error: validationResponse.error.errors
        }, { status: 400 })
    }

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("uid", query.uid);

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


export async function POST(request: NextRequest) {
    const supabase = createClient();

    try {
        const body = await request.json();

        const schema = z.object({
            uid: z.string(),
            name: z.string(),
            dueDate: z.string().datetime(),
        });

        // Validate the request body
        const validationResult = schema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request data",
                    error: validationResult.error.errors,
                },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert([validationResult.data])
            .select();

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                data: data[0],
                success: true,
            },
            { status: 201 }
        );
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                error: e,
            },
            { status: 400 }
        );
    }
}