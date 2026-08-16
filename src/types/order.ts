export type OrderStatus = "ordered" | "preparing" | "ready" | "served";

export interface Order {
    id: string;
    customer_name: string;
    status: OrderStatus;
    created_at: string;
    cleared_at: string | null;
    items: OrderItem[];
    rating: number | null;
}

export interface OrderItem {
    menu_item_id: string;
    name: string;
    quantity: number;
    instructions: string;
    recipe: string;
}

export interface Tag {
    id: string;
    name: string;
    image_url: string;
    is_featured: boolean;
    is_active: boolean;
    theme: string;
    icon: string | null;
    tagline: string | null;
}

export interface MenuItem {
    id: string;
    name: string;
    quantity: number;
    drink_number: number;
    recipe: string;
    available: boolean;
    instructions: string;
    description: string;
    tags: Tag[];
}