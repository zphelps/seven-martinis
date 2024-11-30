import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { task_id: string } }) {
    const { task_id } = params;
    const body = await request.json();

    const schema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        completed: z.boolean().optional(),
        dueDate: z.string().optional(),
    });

    const validationResponse = schema.safeParse(body);
    if (!validationResponse.success) {
        return NextResponse.json({
            message: 'Invalid request schema',
            error: validationResponse.error.errors
        }, { status: 400 });
    }

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("tasks")
            .update(validationResponse.data)
            .eq('id', task_id)
            .select(); // Use select() to return the updated task

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: data[0], // Assuming data is an array and you want the first item
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({
            success: false,
            error: e
        }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { task_id: string } }) {
    const { task_id } = params;
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq('id', task_id);

    if (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 });
    }

    return NextResponse.json({
        success: true,
    }, { status: 200 });
}