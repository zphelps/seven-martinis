export type OrderStatus = "ordered" | "preparing" | "ready" | "served";

export interface Order {
    id: string;
    customer_name: string;
    status: OrderStatus;
    created_at: string;
    items: OrderItem[];
    // Include other properties as needed
}

export interface OrderItem {
    menu_item_id: string;
    quantity: number;
}

export interface MenuItem {
    id: string;
    name: string;
    quantity: number;
    drink_number: number;
    recipe: string;
}