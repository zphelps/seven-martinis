"use client"

import { Tag as TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tag } from "@/types/order"

interface TagFilterProps {
    tags: Tag[]
    selectedTagIds: string[]
    onToggle: (tagId: string) => void
}

export function TagFilter({ tags, selectedTagIds, onToggle }: TagFilterProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start font-normal">
                    <TagIcon className="mr-2 h-4 w-4" />
                    Tags{selectedTagIds.length > 0 ? ` (${selectedTagIds.length})` : ""}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                    {tags.length === 0 && <p className="text-sm text-muted-foreground px-2 py-1">No tags yet</p>}
                    {tags.map((tag) => (
                        <label
                            key={tag.id}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary cursor-pointer"
                        >
                            <Checkbox checked={selectedTagIds.includes(tag.id)} onCheckedChange={() => onToggle(tag.id)} />
                            {tag.name}
                        </label>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
