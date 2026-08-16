"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/features/tags/components/columns"
import { TagsDataTable } from "@/features/tags/components/data-table"
import TagSidebar from "@/features/tags/components/tag-sidebar"
import useTags from "@/features/tags/hooks/use-tags"
import { Tag as TagIcon } from "lucide-react"

export default function TagsPage() {
    const { tags,
        updateTag,
        loading,
        error,
        addTag,
        deleteTag } = useTags()

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse border border-primary/10">
                    <TagIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Loading tags...</p>
            </div>
        )
    }
    if (error) return <div className="text-destructive p-4">Error: {error}</div>

    return (
        <SidebarProvider
            defaultOpen={false}
            style={{
                "--sidebar-width": "22rem",
                "--sidebar-width-mobile": "22rem",
            } as React.CSSProperties}
        >
            <div className="w-full h-screen py-2 overflow-hidden flex bg-background">
                <TagsDataTable
                    columns={columns}
                    data={tags}
                    addTag={addTag} />
                <TagSidebar
                    tags={tags}
                    updateTag={updateTag}
                    deleteTag={deleteTag}
                />
            </div>
        </SidebarProvider>
    )
}
