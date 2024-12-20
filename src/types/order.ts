export type OrderStatus = "ordered" | "preparing" | "ready";

export interface Order {
    id: string;
    customer_name: string;
    status: OrderStatus;
    created_at: string;
    items: OrderItem[];
    // Include other properties as needed
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    drink_number: number;
    recipe: string;
}