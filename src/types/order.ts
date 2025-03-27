export type OrderStatus = "ordered" | "preparing" | "ready" | "served";

export interface Order {
    id: string;
    customer_name: string;
    status: OrderStatus;
    created_at: string;
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

export interface MenuItem {
    id: string;
    name: string;
    quantity: number;
    drink_number: number;
    recipe: string;
    available: boolean;
    instructions: string;
    description: string;
    tags: string[];
}