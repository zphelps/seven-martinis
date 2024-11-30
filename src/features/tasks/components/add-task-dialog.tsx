import React, { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

// Define the schema
const taskSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dueDate: z.date({ required_error: "Due date is required" }),
});

interface AddTaskDialogProps {
    userId: string;
}

export default function AddTaskDialog({ userId }: AddTaskDialogProps) {
    const [name, setName] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<{ name?: string; dueDate?: string }>({});
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        setLoading(true);
        const result = taskSchema.safeParse({ name, dueDate });
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors({
                name: fieldErrors.name?.[0],
                dueDate: fieldErrors.dueDate?.[0],
            });
            return;
        }

        setErrors({});

        const newTask = {
            uid: userId,
            name,
            dueDate: dueDate!.toISOString(),
            completed: false,
        };

        try {
            const response = await api.post("/tasks", newTask);
            const { success, error } = response as any;
            if (success) {
                toast({
                    title: "Task added successfully",
                    duration: 1000,
                    variant: "default",
                });
                setName("");
                setDueDate(null);
                setOpen(false);
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: error,
                    duration: 3000,
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                variant: "destructive",
                description: error.message,
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Input
                            placeholder="Task Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate || undefined}
                                    onSelect={(selectedDate) => {
                                        setDueDate(selectedDate ?? null);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.dueDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={handleAdd}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Add Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}