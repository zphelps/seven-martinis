import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestInputProps {
    guestCount: string;
    setGuestCount: (value: string) => void;
}

export function GuestInput({ guestCount, setGuestCount }: GuestInputProps) {
    const isSeven = guestCount === "7";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuestCount(e.target.value);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="guests" className="font-cormorant">
                Number of Guests
            </Label>
            <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                placeholder="7?"
                value={guestCount}
                onChange={handleChange}
                className={`transition-colors duration-300 bg-neutral-900 border ${
                    isSeven
                        ? "border-amber-400 text-amber-400"
                        : "border-neutral-700 text-neutral-100"
                } placeholder:text-neutral-500`}
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
