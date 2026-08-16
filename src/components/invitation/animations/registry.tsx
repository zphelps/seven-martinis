"use client";

import { ComponentType } from "react";
import Snowfall from "react-snowfall";
import Confetti from "react-confetti";
import { EventAnimation } from "@/types/invitation";

function SnowfallEffect({ config }: { config: Record<string, any> }) {
    return <Snowfall snowflakeCount={config.snowflakeCount ?? 200} />;
}

function ConfettiEffect({ config }: { config: Record<string, any> }) {
    return (
        <Confetti
            recycle={config.recycle ?? false}
            numberOfPieces={config.numberOfPieces ?? 500}
        />
    );
}

// New animation types require a component here plus a matching row in the
// `animation_registry` table. Once registered, enabling/disabling and tuning
// config per event is backend-driven from the dashboard.
export const ANIMATION_COMPONENTS: Record<string, ComponentType<{ config: Record<string, any> }>> = {
    snowfall: SnowfallEffect,
    confetti: ConfettiEffect,
};

export function InvitationAnimations({ animations }: { animations: EventAnimation[] }) {
    return (
        <>
            {animations.map((animation, index) => {
                const Component = ANIMATION_COMPONENTS[animation.key];
                if (!Component) return null;
                return <Component key={`${animation.key}-${index}`} config={animation.config ?? {}} />;
            })}
        </>
    );
}
