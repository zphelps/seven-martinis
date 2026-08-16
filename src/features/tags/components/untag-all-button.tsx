import { Button } from "@/components/ui/button";
import { Loader2, UnlinkIcon } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

interface UntagAllButtonProps {
    id: string;
    drinkCount: number;
    untagAllDrinks: (id: string) => Promise<void>;
    onDone: () => void;
}

export const UntagAllButton = ({ id, drinkCount, untagAllDrinks, onDone }: UntagAllButtonProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUntagAll = async () => {
        setLoading(true);
        try {
            await untagAllDrinks(id);
            onDone();
            toast({ title: "Tag removed from all drinks" });
        } catch (error) {
            toast({ title: "Failed to untag drinks", variant: "destructive" });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full border-gray-300" disabled={drinkCount === 0}>
                    <UnlinkIcon className="w-4 h-4" />
                    <p>Untag All Drinks{drinkCount > 0 ? ` (${drinkCount})` : ""}</p>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Untag all drinks?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove this tag from all {drinkCount} drink{drinkCount === 1 ? "" : "s"} currently tagged with it.
                        The tag itself will not be deleted, but you&apos;ll need to re-tag drinks individually afterward. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={loading} variant="destructive" onClick={handleUntagAll}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Untag All Drinks"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
