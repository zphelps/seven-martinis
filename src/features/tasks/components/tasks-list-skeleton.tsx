import { Skeleton } from "@/components/ui/skeleton";

export default function TasksListSkeleton() {
    return (
        <>
            {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
            ))}
        </>
    )
}