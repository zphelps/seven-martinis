import { Button } from "@/components/ui/button";
import { Loader2, TrashIcon } from "lucide-react";

interface DeleteTagButtonProps {
    id: string;
    deleteTag: (id: string) => Promise<void>;
}

import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export const DeleteTagButton = ({ id, deleteTag }: DeleteTagButtonProps) => {
    const [open, setOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const router = useRouter();

    const handleDelete = async () => {
        setDeleteLoading(true);
        await deleteTag(id);
        router.push("/dashboard/tags");
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
                        Are you sure you want to delete this tag? It will be removed from every drink it&apos;s applied to. This action cannot be undone.
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
