"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvitationEditor, InvitationSavePayload } from "@/features/invitations/components/invitation-editor";

export default function NewInvitationPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const handleSave = async (payload: InvitationSavePayload) => {
        setSaving(true);
        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create invitation");
            }

            router.push(`/dashboard/invitations/${result.data.id}`);
        } finally {
            setSaving(false);
        }
    };

    return <InvitationEditor onSave={handleSave} saving={saving} />;
}
