"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { UpdateTagProps } from "../hooks/use-tags";
import { DeleteTagButton } from "./delete-tag-button";
import { DisableTagButton } from "./disable-tag-button";
import { UntagAllButton } from "./untag-all-button";
import { TagWithCounts } from "./columns";
import { FeaturedStylePicker } from "./featured-style-picker";

interface TagSidebarProps {
    tags: TagWithCounts[],
    updateTag: (id: string, tag: UpdateTagProps) => Promise<void>,
    untagAllDrinks: (id: string) => Promise<void>,
    onUntagAllDone: () => void,
    deleteTag: (id: string) => Promise<void>
}

export default function TagSidebar({ tags, updateTag, untagAllDrinks, onUntagAllDone, deleteTag }: TagSidebarProps) {
    const { toggleSidebar, open } = useSidebar()
    const router = useRouter()

    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    const [tag, setTag] = useState<TagWithCounts | null>(null)
    const [name, setName] = useState("")
    const [tagline, setTagline] = useState<string | null>(null)

    useEffect(() => {
        if (id && !open) {
            toggleSidebar()
        } else if (!id && open) {
            toggleSidebar()
        }
    }, [id, open])

    useEffect(() => {
        if (id) {
            setTag(tags.find((t) => t.id === id) || null)
        }
    }, [id, tags])

    useEffect(() => {
        setName(tag?.name || "")
        setTagline(tag?.tagline ?? null)
    }, [tag])

    const handleRename = async () => {
        if (!tag || !name || name === tag.name) return
        await updateTag(tag.id, { name })
        toast({ title: "Tag renamed" })
    }

    const handleFeaturedToggle = async (checked: boolean) => {
        if (!tag) return
        await updateTag(tag.id, { is_featured: checked })
        toast({ title: checked ? "Tag marked as featured" : "Tag removed from featured" })
    }

    const handleThemeChange = async (theme: string) => {
        if (!tag) return
        await updateTag(tag.id, { theme })
    }

    const handleIconChange = async (icon: string | null) => {
        if (!tag) return
        await updateTag(tag.id, { icon })
    }

    const handleTaglineBlur = async () => {
        if (!tag || tagline === (tag.tagline ?? null)) return
        await updateTag(tag.id, { tagline: tagline || null })
    }

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!tag || !event.target.files?.[0]) return
        await updateTag(tag.id, { image: event.target.files[0] })
        toast({ title: "Tag image updated" })
    }

    return (
        <Sidebar side="right" variant="floating" className="pl-0 bg-white">
            <SidebarHeader className="gap-3.5 border-b h-[48px] bg-white rounded-t-lg flex justify-center">
                <div className="flex justify-between items-center gap-2">
                    <p className="text-md font-medium px-1">
                        {tag ? tag.name : "Tags"}
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/tags")}>
                        <XIcon className="w-4 h-4" />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-white h-full rounded-b-lg">
                <SidebarGroup className="px-0 h-full">
                    <SidebarGroupContent className="bg-white h-full">
                        {tag && (
                            <div className="space-y-4 -mt-2 h-full flex flex-col overflow-y-auto pb-4">
                                {/* Image */}
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    {tag.image_url ? (
                                        <img src={tag.image_url} alt={tag.name} className="flex w-full h-full object-cover" />
                                    ) : (
                                        <p className="text-xs text-center text-gray-500">No Image</p>
                                    )}
                                </div>

                                <div className="space-y-3 px-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="tag-name">Name</Label>
                                        <Input
                                            id="tag-name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onBlur={handleRename}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="tag-image">Replace Image</Label>
                                        <Input id="tag-image" type="file" accept="image/*" onChange={handleImageChange} />
                                    </div>

                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <div>
                                            <Label>Featured</Label>
                                            <p className="text-xs text-gray-500">
                                                Highlighted section on the menu.
                                            </p>
                                        </div>
                                        <Switch checked={tag.is_featured} onCheckedChange={handleFeaturedToggle} />
                                    </div>

                                    {tag.is_featured && (
                                        <FeaturedStylePicker
                                            theme={tag.theme}
                                            icon={tag.icon}
                                            tagline={tagline}
                                            onThemeChange={handleThemeChange}
                                            onIconChange={handleIconChange}
                                            onTaglineChange={setTagline}
                                            onTaglineBlur={handleTaglineBlur}
                                        />
                                    )}

                                    {!tag.is_active && (
                                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
                                            This tag is disabled and hidden from the menu. Drinks tagged with it keep their tag.
                                        </p>
                                    )}
                                </div>

                                <div className="px-2 mt-auto">
                                    <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-2">
                                        <p className="text-sm font-semibold text-red-700">Danger Zone</p>
                                        <p className="text-xs text-red-600/80">
                                            {tag.totalDrinks} drink{tag.totalDrinks === 1 ? "" : "s"} currently tagged.
                                        </p>
                                        <DisableTagButton id={tag.id} isActive={tag.is_active} updateTag={updateTag} />
                                        <UntagAllButton
                                            id={tag.id}
                                            drinkCount={tag.totalDrinks}
                                            untagAllDrinks={untagAllDrinks}
                                            onDone={onUntagAllDone}
                                        />
                                        <DeleteTagButton id={tag.id} deleteTag={deleteTag} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
