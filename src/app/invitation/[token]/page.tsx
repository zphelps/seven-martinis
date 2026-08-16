import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { InvitationView } from "@/components/invitation/InvitationView";
import { Event, EventDetailItem, InvitationPayload } from "@/types/invitation";

interface InvitationByTokenPageProps {
    params: { token: string };
}

export default async function InvitationByTokenPage({ params }: InvitationByTokenPageProps) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_invitation_by_token", { p_token: params.token });

    if (error) {
        console.error("Error loading invitation:", error);
        notFound();
    }

    const payload = data as InvitationPayload | null;
    if (!payload?.event) {
        notFound();
    }

    return (
        <InvitationView
            event={payload.event as Event}
            details={(payload.details ?? []) as EventDetailItem[]}
        />
    );
}
