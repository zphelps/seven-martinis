import { useEffect, useState } from "react"
import { Tag } from "@/types/order"

export interface AddTagProps {
    name: string
    is_featured: boolean
    image: File | null
    theme: string
    icon: string | null
    tagline: string | null
}

export interface UpdateTagProps {
    name?: string
    is_featured?: boolean
    is_active?: boolean
    image?: File | null
    theme?: string
    icon?: string | null
    tagline?: string | null
}

const useTags = () => {
    const [tags, setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getTags = async () => {
        try {
            const response = await fetch("/api/tags")
            const result = await response.json()

            if (response.ok) {
                setTags(result.data)
            } else {
                setError(result.error)
            }
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const addTag = async (tag: AddTagProps) => {
        const formData = new FormData()
        formData.append("name", tag.name)
        formData.append("is_featured", String(tag.is_featured))
        formData.append("theme", tag.theme)
        formData.append("icon", tag.icon ?? "")
        formData.append("tagline", tag.tagline ?? "")
        if (tag.image) {
            formData.append("image", tag.image)
        }

        try {
            const res = await fetch("/api/tags", {
                method: "POST",
                body: formData,
            })
            if (!res.ok) {
                throw new Error("Failed to create tag")
            }
            const { data: newTag } = await res.json()
            setTags((prevTags) => [...prevTags, newTag])
            return newTag
        } catch (error: any) {
            setError(error.message)
        }
    }

    const updateTag = async (id: string, tag: UpdateTagProps) => {
        const previousTags = [...tags]
        setTags((prevTags) =>
            prevTags.map((t) => (t.id === id ? { ...t, ...tag } : t) as Tag)
        )

        const formData = new FormData()
        if (tag.name !== undefined) formData.append("name", tag.name)
        if (tag.is_featured !== undefined) formData.append("is_featured", String(tag.is_featured))
        if (tag.is_active !== undefined) formData.append("is_active", String(tag.is_active))
        if (tag.theme !== undefined) formData.append("theme", tag.theme)
        if (tag.icon !== undefined) formData.append("icon", tag.icon ?? "")
        if (tag.tagline !== undefined) formData.append("tagline", tag.tagline ?? "")
        if (tag.image) formData.append("image", tag.image)

        try {
            const response = await fetch(`/api/tags/${id}`, {
                method: "PUT",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to update tag")
            }

            const { data: updatedTag } = await response.json()
            setTags((prevTags) => prevTags.map((t) => (t.id === id ? updatedTag : t)))
        } catch (e: any) {
            setError(e.message)
            setTags(previousTags)
        }
    }

    const untagAllDrinks = async (id: string) => {
        const response = await fetch(`/api/tags/${id}/untag-all`, { method: "POST" })
        if (!response.ok) {
            throw new Error("Failed to untag drinks")
        }
    }

    const deleteTag = async (id: string) => {
        try {
            const response = await fetch(`/api/tags/${id}`, { method: "DELETE" })
            if (!response.ok) {
                throw new Error("Failed to delete tag")
            }

            setTags((prevTags) => prevTags.filter((t) => t.id !== id))
        } catch (error: any) {
            setError(error.message)
        }
    }

    useEffect(() => {
        getTags()
    }, [])

    return { tags, loading, error, addTag, updateTag, untagAllDrinks, deleteTag }
}

export default useTags
