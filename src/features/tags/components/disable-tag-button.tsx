import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { UpdateTagProps } from "../hooks/use-tags";

interface DisableTagButtonProps {
    id: string;
    isActive: boolean;
    updateTag: (id: string, tag: UpdateTagProps) => Promise<void>;
}

export const DisableTagButton = ({ id, isActive, updateTag }: DisableTagButtonProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEnable = async () => {
        await updateTag(id, { is_active: true });
        toast({ title: "Tag enabled", description: "It will show up on the menu again." });
    };

    const handleDisable = async () => {
        setLoading(true);
        await updateTag(id, { is_active: false });
        setLoading(false);
        setOpen(false);
        toast({ title: "Tag disabled", description: "It's hidden from the menu but stays tagged to its drinks." });
    };

    if (!isActive) {
        return (
            <Button variant="outline" size="sm" className="w-full border-gray-300" onClick={handleEnable}>
                <EyeIcon className="w-4 h-4" />
                <p>Enable Tag</p>
            </Button>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full border-gray-300">
                    <EyeOffIcon className="w-4 h-4" />
                    <p>Disable Tag</p>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Disable this tag?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This tag will be hidden from the menu filter bar, drink badges, and featured sections.
                        Drinks will stay tagged with it, and you can re-enable it at any time.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={loading} variant="destructive" onClick={handleDisable}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disable Tag"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
