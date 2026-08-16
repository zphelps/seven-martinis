// One-off migration: seed the new `tags` table + `tag_images` storage bucket
// from the hardcoded tag lists/images that used to live in the frontend, and
// backfill `menu_item_tags` from the existing `menu_items.tags` text[] column.
//
// Requires the `tags` / `menu_item_tags` tables + `tag_images` bucket to
// already exist (see supabase/migrations/20260816030000_tags.sql).
//
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-tags.mjs
//
// Run against a local Supabase instance first and verify via /dashboard/tags
// before running against production.

import { createClient } from "@supabase/supabase-js"
import { readFile } from "node:fs/promises"
import path from "node:path"

const KNOWN_TAGS = [
    { name: "Winter", isFeatured: true },
    { name: "Vodka", isFeatured: false },
    { name: "Gin", isFeatured: false },
    { name: "Bourbon", isFeatured: false },
    { name: "Tequila", isFeatured: false },
    { name: "Rum", isFeatured: false },
    { name: "Whiskey", isFeatured: false },
    { name: "Wine", isFeatured: false },
    { name: "New", isFeatured: false },
    { name: "Special", isFeatured: false },
    { name: "Copycats", isFeatured: false },
]

const BUCKET = "tag_images"

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script."
        )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
    })

    const tagIdByName = new Map()

    for (const tag of KNOWN_TAGS) {
        const fileName = `${tag.name.toLowerCase()}.png`
        const filePath = path.join(process.cwd(), "public", fileName)
        const fileBuffer = await readFile(filePath)

        const storagePath = `${Date.now()}-${fileName}`
        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, fileBuffer, {
                contentType: "image/png",
                upsert: false,
            })

        if (uploadError) {
            throw new Error(`Failed to upload ${fileName}: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(storagePath)

        const { data: insertedTag, error: insertError } = await supabase
            .from("tags")
            .insert({
                name: tag.name,
                image_url: publicUrlData.publicUrl,
                is_featured: tag.isFeatured,
            })
            .select("id, name")
            .single()

        if (insertError) {
            throw new Error(`Failed to insert tag ${tag.name}: ${insertError.message}`)
        }

        tagIdByName.set(insertedTag.name, insertedTag.id)
        console.log(`Created tag "${insertedTag.name}" -> ${publicUrlData.publicUrl}`)
    }

    const { data: menuItems, error: menuItemsError } = await supabase
        .from("menu_items")
        .select("id, tags")

    if (menuItemsError) {
        throw new Error(`Failed to fetch menu_items: ${menuItemsError.message}`)
    }

    const associations = []
    for (const menuItem of menuItems ?? []) {
        for (const tagName of menuItem.tags ?? []) {
            const tagId = tagIdByName.get(tagName)
            if (!tagId) {
                console.warn(
                    `Menu item ${menuItem.id} references unknown tag "${tagName}" - skipping`
                )
                continue
            }
            associations.push({ menu_item_id: menuItem.id, tag_id: tagId })
        }
    }

    if (associations.length > 0) {
        const { error: associationsError } = await supabase
            .from("menu_item_tags")
            .insert(associations)

        if (associationsError) {
            throw new Error(
                `Failed to insert menu_item_tags: ${associationsError.message}`
            )
        }
    }

    console.log(
        `Linked ${associations.length} menu item / tag associations across ${menuItems?.length ?? 0} menu items.`
    )
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
