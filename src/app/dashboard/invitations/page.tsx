"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import useEvents from "@/features/invitations/hooks/use-events";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function InvitationsPage() {
    const { events, loading, error, deleteEvent } = useEvents();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading invitations...</p>
            </div>
        );
    }

    if (error) return <div className="text-destructive p-4">Error: {error}</div>;

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this invitation? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            await deleteEvent(id);
            toast({ title: "Invitation deleted" });
        } catch (e: any) {
            toast({ title: "Failed to delete invitation", description: e.message, variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    const copyLink = (token: string) => {
        const url = `${window.location.origin}/invitation/${token}`;
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied" });
    };

    return (
        <div className="container-lg mx-0 mb-2.5 space-y-4 bg-background p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Invitations</h1>
                <Button asChild>
                    <Link href="/dashboard/invitations/new">
                        <Plus className="w-4 h-4 mr-1" /> Create Invitation
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No invitations yet. Create one to get started.
                            </TableCell>
                        </TableRow>
                    )}
                    {events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium">
                                <Link href={`/dashboard/invitations/${event.id}`} className="hover:underline">
                                    {event.title}
                                </Link>
                            </TableCell>
                            <TableCell>{event.event_date ?? "-"}</TableCell>
                            <TableCell>
                                <Badge variant={event.status === "published" ? "default" : "secondary"}>
                                    {event.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => copyLink(event.token)}>
                                    Copy link
                                </Button>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/dashboard/invitations/${event.id}`}>Edit</Link>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={deletingId === event.id}
                                    onClick={() => handleDelete(event.id)}
                                >
                                    {deletingId === event.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
