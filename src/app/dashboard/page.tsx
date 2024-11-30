"use client"
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import UserAvatarButton from "@/components/user-avatar-button";
import { toast } from "@/components/ui/use-toast";
import AddTaskDialog from "@/features/tasks/components/add-task-dialog";
import { api } from "@/lib/api";
import TasksList from "@/features/tasks/components/tasks-list";
import { Button } from "@/components/ui/button";
import TasksListSkeleton from "@/features/tasks/components/tasks-list-skeleton";

export default function Dashboard() {
    const { user } = useAuth();
    const [uid, setUid] = useState(user?.id!);
    const { tasks, loading, error } = useTasks({ uid });

    async function toggleComplete(taskId: string, completed: boolean) {
        try {
            const response = await api.put(`/tasks/${taskId}`, { completed });
            const { success, error, data } = response as any;

            if (success) {
                toast({
                    title: `Task marked as ${data.completed ? "completed" : "incomplete"}`,
                    duration: 1000,
                    variant: "default",
                });
            } else {
                throw new Error(error);
            }
        } catch (e: any) {
            toast({
                title: "Error",
                variant: "destructive",
                description: e.message,
                duration: 3000,
            });
        }
    }

    async function onDelete(taskId: string) {
        try {
            const response = await api.delete(`/tasks/${taskId}`);
            const { success, error } = response as any;

            if (success) {
                toast({
                    title: "Task deleted successfully",
                    duration: 1000,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: error,
                    duration: 3000,
                });
            }
        } catch (e: any) {
            toast({
                title: "Error",
                variant: "destructive",
                description: e.message,
                duration: 3000,
            });
        }
    }

    return (
        <div className="container mx-auto my-10 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className={'font-bold text-4xl'}>
                        Good Morning! 🌤️
                    </p>
                    <p className="text-gray-400 text-xl">
                        Here are your tasks for today
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <AddTaskDialog userId={user?.id!} />
                    <UserAvatarButton />
                </div>
            </div>
            {loading && <TasksListSkeleton />}
            {error && <div>Error: {error}</div>}
            {!loading && <TasksList tasks={tasks} onDelete={onDelete} toggleComplete={toggleComplete} />}
        </div>
    );
}