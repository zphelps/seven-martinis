"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {GuestInput} from "@/components/invitation/GuestInput";
import { createClient } from "@/utils/supabase/client";



interface ReservationModalProps {
    date: Date;
}

export function ReservationModal({ date }: ReservationModalProps) {
    const [open, setOpen] = useState(false);
    const [guestCount, setGuestCount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const phoneNumber = formData.get("phone") as string;
        const email = formData.get("email") as string;

        const guestNum = Number(guestCount) || null;
        const eventDate = date.toISOString().split("T")[0];

        const { error } = await createClient().from("attendees").insert([
            {
                name,
                phoneNumber,
                email,
                guestNum,
                eventDate,
            },
        ]);

        setIsSubmitting(false);

        if (error) {
            console.error("Error saving RSVP:", error);
            alert("Something went wrong. Please try again.");
            return;
        }

        // e.currentTarget.reset();
        // setGuestCount("");
        setSubmitted(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="font-cormorant px-6 py-3 bg-neutral-900 text-neutral-100 rounded-md border border-neutral-700 transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
                >
                    Join the Seven
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-lg bg-neutral-950 border border-neutral-800 rounded-xl shadow-lg p-8 text-neutral-200">
                <DialogHeader>
                    <DialogTitle className="font-cormorant text-3xl text-center text-neutral-100 mb-2">
                        Take Your Seat Among the Seven
                    </DialogTitle>
                    <p className="text-center text-neutral-400 text-sm italic">
                        A gentle pull opens the door, but seven moments later, you will forget the world outside.
                    </p>
                </DialogHeader>

                {!submitted ? (
                    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-neutral-300 font-cormorant">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                data-1p-ignore
                                placeholder="Seven Costanza"
                                className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-neutral-300 font-cormorant">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                required
                                data-1p-ignore
                                placeholder="(777) 777-7777"
                                className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-neutral-300 font-cormorant">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                data-1p-ignore
                                placeholder="seven@sevenmartinis.com"
                                className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <GuestInput guestCount={guestCount} setGuestCount={setGuestCount} />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 font-cormorant bg-neutral-200 text-neutral-900 rounded-md border border-neutral-400 py-3 transition-colors duration-200 hover:bg-neutral-300 hover:text-neutral-950 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit RSVP"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-neutral-200 font-cormorant text-xl mb-2">Welcome to the Seven. See you soon.</p>
                    </div>
                )}

                <p className="text-center text-xs text-neutral-500 mt-6 italic">
                    We will see you where the wood whispers and the panels part.
                </p>
            </DialogContent>
        </Dialog>
    );
}
