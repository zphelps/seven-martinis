"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function StoryOfSevenMartinis() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="font-cormorant px-6 py-3 bg-neutral-200 text-neutral-900 rounded-md border border-neutral-400 transition-colors duration-200 hover:bg-neutral-300 hover:text-neutral-950"
                >
                    The 7M Story
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md md:max-w-lg bg-neutral-100 border border-neutral-300 rounded-xl shadow-lg p-8">
                <DialogHeader>
                    <DialogTitle className="font-cormorant text-3xl text-center text-neutral-900 mb-2">
                        Behind the Door: The 7M Story
                    </DialogTitle>
                </DialogHeader>

                <div className="text-neutral-800 font-cormorant leading-relaxed space-y-5">
                    <p>
                        It began, as all good stories do, in the quiet corners of the night. Two kindred spirits, drawn together by the allure of hidden rooms and the artistry of a well-made martini, spent their evenings chasing the magic that lives between jazz and candlelight.
                    </p>
                    <p>
                        One evening, they ordered seven martinis. Out of that ritual came an idea: a haven for those who understood that elegance and indulgence need not be strangers.
                    </p>
                    <p>
                        <em>Seven Martinis</em> was born from that promise — a speakeasy devoted to the craft of conversation and the good taste of quiet rebellion. Behind its discreet door, we count by sevens: in martinis, in memories, and in the moments that make a night unforgettable.
                    </p>
                    <div className="text-center text-xs text-neutral-700 italic space-y-2">
                        <h4 className="font-cormorant text-sm font-semibold uppercase tracking-wide text-neutral-800 not-italic mb-2">
                            The People Behind the Door
                        </h4>
                        <p>Seven Martinis was founded by Suzanne and Sheldon Phelps — though only one dares to tell the unadulterated origin of the name.</p>
                        <p><a target={"_blank"} href={"https://www.davidwolfebender.com"}>David Wolfe Bender</a>, Head Mixologist — curator of every menu, guided by the belief that cocktails are as much about character as they are ingredients.</p>
                        <p>7M Interior Design by Stephanie Weitkamp — creator of every corner's elegance and intent.</p>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
