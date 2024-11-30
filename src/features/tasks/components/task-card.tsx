
import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import DeleteTaskDialog from "./delete-task-dialog";

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => Promise<void>;
    toggleComplete: (taskId: string, completed: boolean) => Promise<void>;
}

export default function TaskCard({ task, onDelete, toggleComplete }: TaskCardProps) {

    const [checked, setChecked] = useState(task.completed);

    const handleToggleComplete = async () => {
        setChecked(!checked);
        await toggleComplete(task.id, !checked);
    }

    return (
        <div className="px-4 py-2 shadow-md rounded-lg border bg-white bg-opacity-10 flex items-center justify-between">
            <div className="flex items-center">
                <Checkbox
                    checked={checked}
                    className="mr-4 w-6 h-6"
                    onCheckedChange={handleToggleComplete}
                />
                <div>
                    <p className="font-bold text-lg">{task.name}</p>
                    <p className="text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <DeleteTaskDialog taskId={task.id} onDelete={onDelete} />
            </div>
        </div>
    )
}