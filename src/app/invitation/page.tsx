import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { InvitationPayload } from "@/types/invitation";

// No token in the URL: fall back to whichever event is currently published,
// so an old bookmark or the bare /invitation path still resolves to something.
export default async function InvitationIndexPage() {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_latest_published_invitation");

    if (error) {
        console.error("Error loading latest invitation:", error);
        notFound();
    }

    const payload = data as InvitationPayload | null;
    if (!payload?.event?.token) {
        notFound();
    }

    redirect(`/invitation/${payload.event.token}`);
}
