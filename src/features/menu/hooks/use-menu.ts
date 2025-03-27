import { MenuItem } from '@/types/order';
import { useState, useEffect } from 'react';

export interface AddMenuItemProps {
    id: string;
    drink_number: number;
    name: string;
    description: string;
    available: boolean;
    instructions: string;
}

export interface UpdateMenuItemProps {
    drink_number?: number;
    name?: string;
    description?: string;
    available?: boolean;
    instructions?: string;
    tags?: string[];
}

interface UseMenuProps {
    onlyAvailable: boolean;
}

const useMenu = ({ onlyAvailable = false }: UseMenuProps) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const addMenuItem = async (item: AddMenuItemProps) => {
        try {
            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            const result = await response.json();

            console.log("Result", result)

            if (response.ok) {
                setMenuItems(prev => [...prev, result.data] as MenuItem[]);
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to add menu item');
            }
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    }

    const deleteMenuItem = async (id: string) => {
        try {
            const response = await fetch(`/api/menu/${id}`, { method: "DELETE" })
            if (!response.ok) {
                throw new Error("Failed to delete menu item")
            }

            setMenuItems((prevMenuItems) => prevMenuItems.filter((item) => item.id !== id))
        } catch (error: any) {
            setError(error.message)
        }
    }

    const updateMenuItem = async (id: string, item: UpdateMenuItemProps) => {
        const previousMenuItems = [...menuItems]
        setMenuItems((prevMenuItems) =>
            prevMenuItems.map((menuItem) => (menuItem.id === id ? { ...menuItem, ...item } : menuItem) as MenuItem)
        )

        try {
            const response = await fetch(`/api/menu/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            })

            if (!response.ok) {
                throw new Error("Failed to update menu item")
            }

        } catch (e: any) {
            setError(e.message)
            setMenuItems(previousMenuItems)
        }
    }

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`/api/menu?onlyAvailable=${onlyAvailable}`);
                const result = await response.json();

                if (response.ok) {
                    setMenuItems(result.data);
                } else {
                    setError(result.error);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    return { menuItems, loading, error, addMenuItem, updateMenuItem, deleteMenuItem };
};

export default useMenu;
