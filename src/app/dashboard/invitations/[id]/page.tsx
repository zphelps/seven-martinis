"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { InvitationEditor, InvitationSavePayload } from "@/features/invitations/components/invitation-editor";
import { Event, EventDetailItem } from "@/types/invitation";

interface EditInvitationPageProps {
    params: { id: string };
}

export default function EditInvitationPage({ params }: EditInvitationPageProps) {
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [details, setDetails] = useState<EventDetailItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${params.id}`);
                const result = await response.json();

                if (response.ok) {
                    setEvent(result.data.event);
                    setDetails(result.data.details);
                } else {
                    setError(result.error);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [params.id]);

    const handleSave = async (payload: InvitationSavePayload) => {
        setSaving(true);
        try {
            const response = await fetch(`/api/events/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save invitation");
            }

            setEvent(result.data);
            router.refresh();
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading invitation...</p>
            </div>
        );
    }

    if (error || !event) {
        return <div className="text-destructive p-4">Error: {error ?? "Invitation not found"}</div>;
    }

    return <InvitationEditor initialEvent={event} initialDetails={details} onSave={handleSave} saving={saving} />;
}
