import { Button } from "@/components/ui/button";
import { Loader2, TrashIcon } from "lucide-react";

interface DeleteItemButtonProps {
    id: string;
    deleteInventoryItem: (id: string) => Promise<void>;
}

import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export const DeleteItemButton = ({ id, deleteInventoryItem }: DeleteItemButtonProps) => {
    const [open, setOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const router = useRouter();

    const handleDelete = async () => {
        setDeleteLoading(true);
        await deleteInventoryItem(id);
        router.push("/dashboard/inventory");
        setDeleteLoading(false);
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full border-gray-300">
                    <TrashIcon className="w-4 h-4" />
                    <p>Delete</p>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={deleteLoading} variant="destructive" onClick={handleDelete}>
                        {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}