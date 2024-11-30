

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "@/types/task";

interface UseTasksParams {
    uid: string;
    dueDate?: string;
    tag?: string;
}

export function useTasks({ uid, dueDate, tag }: UseTasksParams) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await api.get("/tasks", {
                    params: {
                        uid,
                        dueDate,
                        tag,
                    },
                });
                const { data } = response as any;
                setTasks(data);
            } catch (err) {
                setTasks([]);
                setError("Failed to fetch tasks");
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, [uid, dueDate, tag]);

    return { tasks, loading, error };
}
