import { Event } from "@/types/invitation";
import { useState, useEffect } from "react";

const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const deleteEvent = async (id: string) => {
        try {
            const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete invitation");
            }

            setEvents((prev) => prev.filter((event) => event.id !== id));
        } catch (e: any) {
            setError(e.message);
            throw e;
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/events");
                const result = await response.json();

                if (response.ok) {
                    setEvents(result.data);
                } else {
                    setError(result.error);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error, deleteEvent };
};

export default useEvents;
