import Link from "next/link";
import { StoryOfSevenMartinis } from "@/components/invitation/StoryDialog";
import { ReservationModal } from "@/components/invitation/ReservationModal";

// ✅ Create the date as UTC midnight — this guarantees the day stays consistent globally
const CURRENT_DATE = new Date(Date.UTC(2025, 10, 8)); // November is month 10 (0-indexed)

// ✅ Helper to generate “Eighth”, “Ninth”, etc.
function getDayOrdinalWord(day: number) {
    const words = [
        "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh",
        "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth",
        "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth",
        "Nineteenth", "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third",
        "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh",
        "Twenty-Eighth", "Twenty-Ninth", "Thirtieth", "Thirty-First"
    ];
    return words[day - 1];
}

// ✅ Format using UTC to prevent any timezone conversion
const weekday = CURRENT_DATE.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
});

const month = CURRENT_DATE.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "UTC",
});

const dayWord = getDayOrdinalWord(
    new Date(CURRENT_DATE.toLocaleString("en-US", { timeZone: "UTC" })).getUTCDate()
);

export default function Invitation() {
    return (
        <div className="min-h-screen bg-neutral-300 flex items-center justify-center p-8 font-cormorant">
            <div className="max-w-2xl text-center space-y-8">
                <p className="text-lg leading-relaxed">
                    You are cordially invited to an evening of refined indulgence and clandestine revelry during an
                    exclusive and intoxicatingly elegant event at
                </p>

                <div className="flex justify-center">
                    <img
                        src="7MPrimaryCropped.png"
                        alt="Seven Martinis Logo"
                        className="w-44"
                    />
                </div>

                <div className="text-2xl leading-snug">
                    {weekday}, the {dayWord} of {month}
                    <br /> Nine o’clock in the evening until midnight*
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    {/*<Link href={"#"}>*/}
                    {/*    <button*/}
                    {/*        className="font-cormorant px-6 py-3 bg-neutral-900 text-neutral-100 rounded-md border border-neutral-700 transition-colors duration-200 hover:bg-neutral-800 hover:text-white">*/}
                    {/*        Reserve Your Place*/}
                    {/*    </button>*/}
                    {/*</Link>*/}

                    <ReservationModal date={CURRENT_DATE} />

                    {/*<Link href={"invitation/inquiries-addressed"}>*/}
                    {/*    <button*/}
                    {/*        className="font-cormorant px-6 py-3 bg-neutral-200 text-neutral-900 rounded-md border border-neutral-400 transition-colors duration-200 hover:bg-neutral-300 hover:text-neutral-950">*/}
                    {/*        FAQs*/}
                    {/*    </button>*/}
                    {/*</Link>*/}
                    <StoryOfSevenMartinis/>
                </div>

                {/* Sections */}

                <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-10 space-y-10 text-center sm:text-left">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-[150px_1fr] sm:gap-8 gap-4 items-start justify-items-center sm:justify-items-start">
                        <h3 className="font-cormorant text-lg text-neutral-900 font-bold uppercase text-center sm:text-right">
                            Location
                        </h3>
                        <p className="text-neutral-700 leading-relaxed text-center sm:text-left">
                            Lower level of the Phelps Residence<br/>
                            10895 Holliday Farms Blvd., Zionsville, IN 46077 <br/>
                            Follow the signs at the front door upon arrival.
                        </p>
                    </div>

                    <div
                        className="grid grid-cols-1 sm:grid-cols-[150px_1fr] sm:gap-8 gap-4 items-start justify-items-center sm:justify-items-start">
                        <h3 className="font-cormorant text-lg text-neutral-900 font-bold uppercase text-center sm:text-right">
                            Access
                        </h3>
                        <p className="text-neutral-700 leading-relaxed text-center sm:text-left">
                            Upon arrival to the Holliday Farms neighborhood, stop at the gate house and mention you are
                            here
                            for the “Phelps Residence.” Remember, Seven Martinis is a secret.
                        </p>
                    </div>

                    <div
                        className="grid grid-cols-1 sm:grid-cols-[150px_1fr] sm:gap-8 gap-4 items-start justify-items-center sm:justify-items-start">
                        <h3 className="font-cormorant text-lg text-neutral-900 font-bold uppercase text-center sm:text-right">
                            Attire
                        </h3>
                        <p className="text-neutral-700 leading-relaxed text-center sm:text-left">
                            Cocktail attire is often spotted, but it is certainly not required. Dress like you are here
                            for a good drink and an even better story. We’ve seen suits and denim at the same party —
                            both ordered a second round.
                        </p>
                    </div>

                    <div
                        className="grid grid-cols-1 sm:grid-cols-[150px_1fr] sm:gap-8 gap-4 items-start justify-items-center sm:justify-items-start">
                        <h3 className="font-cormorant text-lg text-neutral-900 font-bold uppercase text-center sm:text-right">
                            Selection
                        </h3>
                        <p className="text-neutral-700 leading-relaxed text-center sm:text-left">
                            The 7M mixologists will debut its <em>Seven for Autumn</em> menu, featuring
                            exquisite
                            seasonal flavors and craft cocktails, as well as old favorites and new specials.
                        </p>
                    </div>
                </div>


                {/* Nota Bene */}
                <div className="text-sm leading-relaxed text-neutral-800">
                    <span className="italic font-semibold whitespace-pre-line">N.B.</span> Access to Seven Martinis is
                    by invitation only and may be obtained through a concealed entrance on the lower level of the Phelps
                    Residence. Those in the know will find their way...seek where the wood whispers and the panels part.
                </div>

                {/* Last Call Note */}
                <div className="text-sm leading-relaxed text-neutral-800 mt-6">
                    *Seven Martinis does not participate in this horrifying contemporary notion of “last call.” The bar
                    will remain open so long as bodies remain inside — dead or alive.
                </div>

            </div>
        </div>
    )
}

function Section({title, text}: { title: string; text: string }) {
    return (
        <div className="grid grid-cols-4 gap-4 text-left">
            {/* Left column: title */}
            <h2 className="col-span-1 uppercase tracking-wide font-bold text-xl">
                {title}
            </h2>

            {/* Right column: text */}
            <p className="col-span-3 whitespace-pre-line leading-relaxed">
                {text}
            </p>
        </div>
    )
}
