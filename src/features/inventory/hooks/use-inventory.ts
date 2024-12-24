import { useEffect, useState } from "react"
import { InventoryItem } from "../components/columns"
import { api } from "@/lib/api"

export interface AddInventoryItemProps {
    name: string
    type: string
    stock: string
    image: File | null
}

export interface UpdateInventoryItemProps {
    name?: string
    type?: string
    stock?: string
}

const useInventory = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getInventory = async () => {
        try {
            const response = await fetch("/api/inventory")
            const result = await response.json()

            if (response.ok) {
                setInventory(result.data)
            } else {
                setError(result.error)
            }
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const addInventoryItem = async (item: AddInventoryItemProps) => {
        const formData = new FormData()
        formData.append("name", item.name)
        formData.append("type", item.type)
        formData.append("stock", item.stock)
        if (item.image) {
            formData.append("image", item.image)
        }

        try {
            const res = await fetch("/api/inventory", {
                method: "POST",
                body: formData,
            })
            if (!res.ok) {
                throw new Error("Failed to create item")
            }
            const { data: newItem } = await res.json()
            setInventory((prevInventory) => [...prevInventory, newItem])
            return newItem
        } catch (error: any) {
            setError(error.message)
        }
    }

    const deleteInventoryItem = async (id: string) => {
        try {
            const response = await fetch(`/api/inventory/${id}`, { method: "DELETE" })
            if (!response.ok) {
                throw new Error("Failed to delete inventory item")
            }

            setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id))
        } catch (error: any) {
            setError(error.message)
        }
    }

    const updateInventoryItem = async (id: string, item: UpdateInventoryItemProps) => {
        const previousInventory = [...inventory]
        setInventory((prevInventory) =>
            prevInventory.map((invItem) => (invItem.id === id ? { ...invItem, ...item } : invItem) as InventoryItem)
        )

        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            })

            if (!response.ok) {
                throw new Error("Failed to update inventory item")
            }

        } catch (e: any) {
            setError(e.message)
            setInventory(previousInventory)
        }
    }

    useEffect(() => {
        getInventory()
    }, [])

    return { inventory, updateInventoryItem, loading, error, addInventoryItem, deleteInventoryItem }
}

export default useInventory