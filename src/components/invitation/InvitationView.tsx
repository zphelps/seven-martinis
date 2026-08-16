"use client";

import { StoryOfSevenMartinis } from "@/components/invitation/StoryDialog";
import { ReservationModal } from "@/components/invitation/ReservationModal";
import { InvitationAnimations } from "@/components/invitation/animations/registry";
import { formatInvitationDate } from "@/lib/invitation-date";
import { Event, EventDetailItem } from "@/types/invitation";

interface InvitationViewProps {
    event: Event;
    details: EventDetailItem[];
}

// Renders an invitation exactly as an invitee will see it. Used by both the
// public /invitation/[token] route and the dashboard editor's live preview, so
// there is only ever one place that can drift from what invitees actually see.
export function InvitationView({ event, details }: InvitationViewProps) {
    const dateLabel = formatInvitationDate(event.event_date);

    return (
        <div className="min-h-screen bg-neutral-300 flex items-center justify-center p-8 font-cormorant relative">
            <InvitationAnimations animations={event.animations} />
            <div className="max-w-2xl text-center space-y-8">
                {event.greeting && (
                    <p className="text-lg leading-relaxed">{event.greeting}</p>
                )}

                <div className="flex justify-center">
                    <img
                        src="7MPrimaryCropped.png"
                        alt="Seven Martinis Logo"
                        className="w-44"
                    />
                </div>

                {(dateLabel || event.event_time_label) && (
                    <div className="text-2xl leading-snug">
                        {dateLabel}
                        {dateLabel && event.event_time_label && <br />}
                        {event.event_time_label}
                    </div>
                )}

                <div className="flex gap-4 justify-center mt-8">
                    <ReservationModal eventId={event.id} eventDate={event.event_date} />
                    <StoryOfSevenMartinis />
                </div>

                {details.length > 0 && (
                    <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-10 space-y-10 text-center sm:text-left">
                        {details.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-1 sm:grid-cols-[150px_1fr] sm:gap-8 gap-4 items-start justify-items-center sm:justify-items-start"
                            >
                                <h3 className="font-cormorant text-lg text-neutral-900 font-bold uppercase text-center sm:text-right">
                                    {item.key}
                                </h3>
                                <p className="text-neutral-700 leading-relaxed text-center sm:text-left whitespace-pre-line">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {event.secret_note && (
                    <div className="text-sm leading-relaxed text-neutral-800">
                        <span className="italic font-semibold whitespace-pre-line">N.B.</span> {event.secret_note}
                    </div>
                )}

                {event.footnote && (
                    <div className="text-sm leading-relaxed text-neutral-800 mt-6">
                        <span className="italic font-semibold whitespace-pre-line">N.B.</span> {event.footnote}
                    </div>
                )}
            </div>
        </div>
    );
}
