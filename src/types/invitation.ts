export type EventStatus = "draft" | "published" | "archived";

export interface EventAnimation {
    key: string;
    config: Record<string, any>;
}

export interface EventDetailItem {
    id: string;
    event_id: string;
    key: string;
    value: string;
    sort_order: number;
}

export interface Event {
    id: string;
    created_at: string;
    token: string;
    title: string;
    event_date: string | null;
    event_time_label: string | null;
    greeting: string | null;
    secret_note: string | null;
    footnote: string | null;
    animations: EventAnimation[];
    status: EventStatus;
}

export interface AnimationRegistryItem {
    key: string;
    name: string;
    description: string | null;
    default_config: Record<string, any>;
}

export interface InvitationPayload {
    event: Event;
    details: EventDetailItem[];
}
