import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import TaskCard from "./task-card";

interface TasksListProps {
    tasks: Task[];
    onDelete: (taskId: string) => Promise<void>;
    toggleComplete: (taskId: string, completed: boolean) => Promise<void>;
}

export default function TasksList({ tasks, onDelete, toggleComplete }: TasksListProps) {
    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={onDelete} toggleComplete={toggleComplete} />
            ))}
        </div>
    );
}