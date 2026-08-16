import { useEffect, useState } from "react"
import { Tag } from "@/types/order"

export interface AddTagProps {
    name: string
    is_featured: boolean
    image: File | null
}

export interface UpdateTagProps {
    name?: string
    is_featured?: boolean
    image?: File | null
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

    return { tags, loading, error, addTag, updateTag, deleteTag }
}

export default useTags
