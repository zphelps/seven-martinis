"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function GuestInput() {
    const [guestCount, setGuestCount] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuestCount(e.target.value);
    };

    const isSeven = guestCount === "7";

    return (
        <div className="space-y-2">
            <Label
                htmlFor="guests"
                // className={`font-cormorant transition-colors duration-300 ${
                //     isSeven ? "text-amber-400" : "text-neutral-300"
                // }`}
                className={`font-cormorant`}
            >
                Number of Guests
            </Label>
            <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                placeholder="2"
                value={guestCount}
                onChange={handleChange}
                className={`transition-colors duration-300 bg-neutral-900 border
                    ${
                        isSeven
                            ? "border-amber-400 text-amber-400"
                            : "border-neutral-700 text-neutral-100"
                    } placeholder:text-neutral-500`
                }
                // className={`bg-neutral-900 border`}

            />
            {isSeven && (
                <div>
                    <p className="text-xs text-amber-400 italic font-cormorant">
                        Ah — Seven: the magic number.
                    </p>
                    <img
                        src="/sevenmartinis.gif"
                        alt="Seven magic animation"
                        className="w-24 h-20 opacity-90 rounded-md mt-1"
                    />
                </div>

            )}
        </div>
    );
}


export function ReservationModal() {
    const [open, setOpen] = useState(false);

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

                <form className="mt-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-neutral-300 font-cormorant">Name</Label>
                        <Input id="name" data-1p-ignore required placeholder="Your full name"
                               className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"/>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-neutral-300 font-cormorant">Phone Number</Label>
                        <Input id="phone" type="email" data-1p-ignore required placeholder="(123) 456-7890"
                               className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"/>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-neutral-300 font-cormorant">Email</Label>
                        <Input id="email" type="email" data-1p-ignore required placeholder="you@example.com"
                               className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"/>
                    </div>


                    {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">*/}
                    {/*    <div className="space-y-2">*/}
                    {/*        <Label htmlFor="date" className="text-neutral-300 font-cormorant">Date</Label>*/}
                    {/*        <Input id="date" type="date" className="bg-neutral-900 border-neutral-700 text-neutral-100" />*/}
                    {/*    </div>*/}
                    {/*    <div className="space-y-2">*/}
                    {/*        <Label htmlFor="time" className="text-neutral-300 font-cormorant">Time</Label>*/}
                    {/*        <Input id="time" type="time" className="bg-neutral-900 border-neutral-700 text-neutral-100" />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="space-y-2">
                        <GuestInput/>
                        {/*<Label htmlFor="guests" className="text-neutral-300 font-cormorant">Number of Guests</Label>*/}
                        {/*<Input id="guests" type="number" min="1" max="10" placeholder="2" className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500" />*/}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-neutral-300 font-cormorant">Special Requests</Label>
                        <Textarea id="notes" data-1p-ignore required placeholder="Allergies, preferences, or a joke..."
                                  className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"/>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 font-cormorant bg-neutral-200 text-neutral-900 rounded-md border border-neutral-400 py-3 transition-colors duration-200 hover:bg-neutral-300 hover:text-neutral-950"
                    >
                        Submit RSVP
                    </button>
                </form>

                <p className="text-center text-xs text-neutral-500 mt-6 italic">
                    Confirmation details will be sent discreetly.
                    Your table awaits — if you know the way.
                </p>
            </DialogContent>
        </Dialog>
    );
}
