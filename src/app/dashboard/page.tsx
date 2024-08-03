"use client"
import {Button} from "@/components/ui/button";
import {api} from "@/lib/api";
import {useAuth} from "@/hooks/useAuth";
import {useEffect, useState} from "react";
import {Task} from "@/types/task";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Dashboard() {

    const {user} = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);

    async function addTask() {
        await api.post("/tasks", {
            uid: user?.id,
            name: "New Task",
            description: "This is a new tasks",
            completed: false,
            dueDate: new Date(),
        });
    }

    async function fetchTasks() {
        const response = await api.get("/tasks", {
            params: {
                uid: user?.id
            }
        });
        console.log(response.data);
        setTasks(response.data);
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            <p
                className={'font-bold text-2xl'}
            >
                Good Morning! 🌤️
            </p>
            <div
                className={'p-3 space-y-2'}
            >
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={'rounded-lg p-3 border border-gray-200'}
                    >
                        <p className={'font-bold text-xl'}>
                            {task.name}
                        </p>
                        <p className={'font-medium text-gray-500'}>
                            {task.description}
                        </p>
                    </div>
                ))}
            </div>
            <Button onClick={addTask}>
                Add Task
            </Button>
        </div>
    )
}