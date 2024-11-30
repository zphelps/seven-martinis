import { AlertDialog, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
interface DeleteTaskDialogProps {
    taskId: string;
    onDelete: (taskId: string) => Promise<void>;
}

export default function DeleteTaskDialog({ taskId, onDelete }: DeleteTaskDialogProps) {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        await onDelete(taskId);
        setLoading(false);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={loading} size="icon" variant="ghost" className="rounded-md">
                    {!loading && <Trash className="w-5 h-5 text-gray-300" />}
                    {loading && <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your task.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={handleDelete}>
                        {loading && <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}